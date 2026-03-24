import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/announcements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  async findAll(@Request() req: any) {
    // Everyone can view their own announcements, filtered in service
    const announcements = await this.announcementsService.findAllForUser(req.user.id);
    return {
      data: announcements,
      meta: {},
      errors: [],
    };
  }

  @Post()
  @RequirePermission('create', 'announcement', 'all')
  async create(@Request() req: any, @Body() createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = await this.announcementsService.create(req.user.id, createAnnouncementDto);
    return {
      data: announcement,
      meta: {},
      errors: [],
    };
  }
}
