import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/timesheets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Get()
  async findAll(@Request() req: any, @Query() queryParams: any) {
    const timesheets = await this.timesheetsService.findAll(req.user.id, queryParams);
    return {
      data: timesheets,
      meta: {},
      errors: [],
    };
  }

  @Post()
  @RequirePermission('create', 'timesheet_entry', 'all') // You might want 'own' scope here depending on exact model
  async create(@Request() req: any, @Body() createTimesheetDto: CreateTimesheetDto) {
    const timesheet = await this.timesheetsService.create(req.user.id, createTimesheetDto);
    return {
      data: timesheet,
      meta: {},
      errors: [],
    };
  }

  @Patch(':id')
  @RequirePermission('update', 'timesheet_entry', 'all')
  async update(@Request() req: any, @Param('id') id: string, @Body() updateTimesheetDto: UpdateTimesheetDto) {
    const timesheet = await this.timesheetsService.update(id, req.user.id, updateTimesheetDto);
    return {
      data: timesheet,
      meta: {},
      errors: [],
    };
  }

  @Delete(':id')
  @RequirePermission('delete', 'timesheet_entry', 'all')
  async remove(@Request() req: any, @Param('id') id: string) {
    const result = await this.timesheetsService.remove(id, req.user.id);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }
}
