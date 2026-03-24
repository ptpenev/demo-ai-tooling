import { Injectable, Inject, Logger } from '@nestjs/common';
import { eq, or, and, lte, gte, inArray, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(authorId: string, dto: CreateAnnouncementDto) {
    return await this.db.transaction(async (tx) => {
      const [announcement] = await tx
        .insert(schema.announcements)
        .values({
          title: dto.title,
          content: dto.content,
          author_id: authorId || null,
          valid_from: dto.valid_from ? dto.valid_from : null,
          valid_to: dto.valid_to ? dto.valid_to : null,
        })
        .returning();

      if (dto.targets && dto.targets.length > 0) {
        const targetValues = dto.targets.map(t => ({
          announcement_id: announcement.id,
          target_type: t.target_type,
          target_id: t.target_id || null,
        }));
        await tx.insert(schema.announcement_targets).values(targetValues as any[]);
      } else {
        await tx.insert(schema.announcement_targets).values({
          announcement_id: announcement.id,
          target_type: 'all',
        });
      }

      return announcement;
    });
  }

  async findAllForUser(userId: string) {
    const userProjects = await this.db.query.project_members.findMany({
      where: eq(schema.project_members.user_id, userId)
    });
    const projectIds = userProjects.map(up => up.project_id);

    const now = new Date().toISOString().split('T')[0];

    const targetsQuery: any[] = [
      eq(schema.announcement_targets.target_type, 'all'),
      and(
        eq(schema.announcement_targets.target_type, 'user'),
        eq(schema.announcement_targets.target_id, userId)
      )
    ];

    if (projectIds.length > 0) {
      targetsQuery.push(
        and(
          inArray(schema.announcement_targets.target_type, ['project', 'team']),
          inArray(schema.announcement_targets.target_id, projectIds)
        )
      );
    }

    const validTargets = await this.db.query.announcement_targets.findMany({
      where: or(...targetsQuery)
    });

    const announcementIds = validTargets.map(t => t.announcement_id);

    if (announcementIds.length === 0) return [];

    const announcements = await this.db.query.announcements.findMany({
      where: and(
        inArray(schema.announcements.id, announcementIds),
        or(isNull(schema.announcements.valid_from), lte(schema.announcements.valid_from, now)),
        or(isNull(schema.announcements.valid_to), gte(schema.announcements.valid_to, now))
      ),
      with: {
        author_id: false // Just keep simple
      }
    });

    // In a real app we'd sort by created_at desc. 
    // Drizzle sorting:
    return announcements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async generateBirthdayAnnouncements() {
    this.logger.log('Running birthday check cron...');
    // Real implementation: select users where date_part('month', birth_date) = month and date_part('day', birth_date) = day
    // Since we don't have birth_date on the table per T001, we'll simulate.
    const mockFoundUsers = []; // e.g. [{ name: 'John Doe' }]
    
    if (mockFoundUsers.length > 0) {
      await this.create(null as any, {
        title: 'Happy Birthday!',
        content: `Today is the birthday of ${mockFoundUsers.map(u => u.name).join(', ')}! Wish them well!`,
        targets: [{ target_type: 'all' }]
      });
      this.logger.log(`Created birthday announcement for ${mockFoundUsers.length} users.`);
    }
  }
}
