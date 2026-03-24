import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/polls')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get()
  @RequirePermission('read', 'poll', 'all')
  async findAll() {
    const polls = await this.pollsService.findAll();
    return {
      data: polls,
      meta: {},
      errors: [],
    };
  }

  @Post()
  @RequirePermission('create', 'poll', 'all')
  async create(@Request() req: any, @Body() createPollDto: CreatePollDto) {
    const poll = await this.pollsService.create(req.user.id, createPollDto);
    return {
      data: poll,
      meta: {},
      errors: [],
    };
  }

  @Post(':id/vote')
  @RequirePermission('create', 'poll_vote', 'all')
  async vote(@Request() req: any, @Param('id') id: string, @Body() votePollDto: VotePollDto) {
    const result = await this.pollsService.vote(id, req.user.id, votePollDto);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }
}
