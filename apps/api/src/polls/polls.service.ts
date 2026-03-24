import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { eq, and, isNull, gte, inArray, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';

@Injectable()
export class PollsService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(authorId: string, dto: CreatePollDto) {
    return await this.db.transaction(async (tx) => {
      const [poll] = await tx
        .insert(schema.polls)
        .values({
          question: dto.question,
          is_anonymous: dto.is_anonymous || false,
          allow_multiple: dto.allow_multiple || false,
          results_visibility: dto.results_visibility || 'public',
          deadline: dto.deadline ? new Date(dto.deadline) : null,
          author_id: authorId,
        })
        .returning();

      const optionsToInsert = dto.options.map(opt => ({
        poll_id: poll.id,
        option_text: opt,
      }));

      await tx.insert(schema.poll_options).values(optionsToInsert);

      return poll;
    });
  }

  async findAll() {
    const now = new Date();
    // Return all active polls (deadline > now or null)
    const activePolls = await this.db.query.polls.findMany({
      where: or(isNull(schema.polls.deadline), gte(schema.polls.deadline, now)),
      orderBy: (polls, { desc }) => [desc(polls.created_at)],
    });

    const pollIds = activePolls.map(p => p.id);
    if (pollIds.length === 0) return [];

    const options = await this.db.query.poll_options.findMany({
      where: inArray(schema.poll_options.poll_id, pollIds),
    });

    return activePolls.map(poll => ({
      ...poll,
      options: options.filter(o => o.poll_id === poll.id),
    }));
  }

  async vote(pollId: string, userId: string, dto: VotePollDto) {
    const poll = await this.db.query.polls.findFirst({
      where: eq(schema.polls.id, pollId),
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    if (poll.deadline && new Date() > new Date(poll.deadline)) {
      throw new BadRequestException('Poll deadline has passed');
    }

    if (!poll.allow_multiple && dto.option_ids.length > 1) {
      throw new BadRequestException('Multiple choice is not allowed for this poll');
    }

    // Verify options belong to this poll
    const options = await this.db.query.poll_options.findMany({
      where: and(
        eq(schema.poll_options.poll_id, pollId),
        inArray(schema.poll_options.id, dto.option_ids)
      ),
    });

    if (options.length !== dto.option_ids.length) {
      throw new BadRequestException('One or more options are invalid for this poll');
    }

    // Check for double voting if not anonymous
    if (!poll.is_anonymous) {
      const pollOptionIds = (await this.db.query.poll_options.findMany({
        where: eq(schema.poll_options.poll_id, pollId)
      })).map(o => o.id);

      const existingVote = await this.db.query.poll_votes.findFirst({
        where: and(
          inArray(schema.poll_votes.poll_option_id, pollOptionIds),
          eq(schema.poll_votes.user_id, userId)
        )
      });

      if (existingVote) {
        throw new BadRequestException('You have already voted on this poll');
      }
    }

    const votesToInsert = dto.option_ids.map(optId => ({
      poll_option_id: optId,
      user_id: poll.is_anonymous ? null : userId,
    }));

    await this.db.insert(schema.poll_votes).values(votesToInsert as any[]);

    return { success: true };
  }
}
