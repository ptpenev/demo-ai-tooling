import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GetCalendarDto } from './dto/get-calendar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/calendar')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @RequirePermission('read', 'calendar', 'own')
  async getCalendar(@Request() req: any, @Query() query: GetCalendarDto) {
    const result = await this.calendarService.getAggregatedCalendar(req.user.id, query);
    return {
      data: result,
      meta: {},
      errors: [],
    };
  }
}
