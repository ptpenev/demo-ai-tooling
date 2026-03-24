import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/leaves')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get()
  @RequirePermission('read', 'leave_request', 'own') // Admin/managers will fetch differently or pass target_user_id
  async findAll(@Request() req: any, @Query('target_user_id') targetUserId?: string) {
    const result = await this.leavesService.findAll(req.user.id, targetUserId);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }

  @Post()
  @RequirePermission('create', 'leave_request', 'own')
  async create(@Request() req: any, @Body() createLeaveDto: CreateLeaveRequestDto) {
    const result = await this.leavesService.submitLeaveRequest(req.user.id, createLeaveDto);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }

  @Patch(':id/status')
  @RequirePermission('approve', 'leave_request', 'all') // Depending on design, might be 'team' or 'project'
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLeaveStatusDto,
  ) {
    const result = await this.leavesService.updateStatus(id, req.user.id, updateStatusDto);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }
}
