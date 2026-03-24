import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { eq, and, gte, lte, or, inArray, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { GetCalendarDto } from './dto/get-calendar.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async getAggregatedCalendar(userId: string, query: GetCalendarDto) {
    const { start_date, end_date, scope, project_id, user_id } = query;
    const permissions = await this.usersService.getUserPermissions(userId);

    const canReadAll = permissions.some((p: any) => p.action === 'read' && p.resource === 'calendar' && p.scope === 'all');
    const canReadProject = permissions.some((p: any) => p.action === 'read' && p.resource === 'calendar' && p.scope === 'project');
    const canReadTeam = permissions.some((p: any) => p.action === 'read' && p.resource === 'calendar' && p.scope === 'team');

    let allowedUserIds: string[] = [userId];

    if (scope === 'all') {
      if (!canReadAll) throw new ForbiddenException('You do not have permission to view all calendars');
      allowedUserIds = []; // empty means fetch all
    } else if (scope === 'team' || scope === 'project') {
      if (!canReadProject && !canReadTeam && !canReadAll) {
        throw new ForbiddenException('You do not have permission to view team/project calendars');
      }
      
      const managedProjects = await this.db.query.project_members.findMany({
        where: and(
          eq(schema.project_members.user_id, userId),
          inArray(schema.project_members.project_role, ['manager', 'lead'])
        ),
      });

      const managedProjectIds = managedProjects.map(mp => mp.project_id);

      if (managedProjectIds.length > 0) {
        const teamMembers = await this.db.query.project_members.findMany({
          where: inArray(schema.project_members.project_id, managedProjectIds),
        });
        allowedUserIds = Array.from(new Set([...allowedUserIds, ...teamMembers.map(tm => tm.user_id)]));
      } else {
        // user is not manager/lead of any project, so only own
      }
    } else if (scope && scope !== 'own') {
       throw new ForbiddenException('Invalid scope specified');
    }

    if (user_id) {
      if (allowedUserIds.length > 0 && !allowedUserIds.includes(user_id) && !canReadAll) {
        throw new ForbiddenException('You do not have permission to view this user\'s calendar');
      }
      allowedUserIds = [user_id];
    }

    // 1. Fetch Timesheets
    const tsConditions: any[] = [
      gte(schema.timesheet_entries.date, start_date),
      lte(schema.timesheet_entries.date, end_date),
    ];
    if (allowedUserIds.length > 0) {
      tsConditions.push(inArray(schema.timesheet_entries.user_id, allowedUserIds));
    }
    if (project_id) {
      tsConditions.push(eq(schema.timesheet_entries.project_id, project_id));
    }

    const timesheets = await this.db
      .select({
        date: schema.timesheet_entries.date,
        hours: schema.timesheet_entries.hours,
        time_type: schema.timesheet_entries.time_type,
        project_id: schema.timesheet_entries.project_id,
        project_name: schema.projects.name,
        user_id: schema.timesheet_entries.user_id,
      })
      .from(schema.timesheet_entries)
      .innerJoin(schema.projects, eq(schema.timesheet_entries.project_id, schema.projects.id))
      .where(and(...tsConditions));

    // 2. Fetch Leaves
    const leaveConditions: any[] = [
      lte(schema.leave_requests.start_date, end_date),
      gte(schema.leave_requests.end_date, start_date),
    ];
    if (allowedUserIds.length > 0) {
      leaveConditions.push(inArray(schema.leave_requests.user_id, allowedUserIds));
    }

    const leaves = await this.db
      .select({
        start_date: schema.leave_requests.start_date,
        end_date: schema.leave_requests.end_date,
        status: schema.leave_requests.status,
        leave_type_name: schema.leave_types.name,
        user_id: schema.leave_requests.user_id,
      })
      .from(schema.leave_requests)
      .innerJoin(schema.leave_types, eq(schema.leave_requests.leave_type_id, schema.leave_types.id))
      .where(and(...leaveConditions));

    // 3. Static Holidays
    const holidays = [
      { date: `${start_date.substring(0, 4)}-01-01`, name: "New Year's Day" },
      { date: `${start_date.substring(0, 4)}-12-25`, name: "Christmas Day" }
    ].filter(h => h.date >= start_date && h.date <= end_date);

    // Format output
    const events: any[] = [];

    timesheets.forEach(ts => {
      events.push({
        date: ts.date,
        type: 'timesheet',
        hours: parseFloat(ts.hours as string),
        time_type: ts.time_type,
        project: ts.project_name,
        user_id: ts.user_id,
      });
    });

    leaves.forEach(l => {
      const start = new Date(l.start_date);
      const end = new Date(l.end_date);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (dateStr >= start_date && dateStr <= end_date) {
          events.push({
            date: dateStr,
            type: 'leave',
            leave_type: l.leave_type_name,
            status: l.status,
            user_id: l.user_id,
          });
        }
      }
    });

    holidays.forEach(h => {
      events.push({
        date: h.date,
        type: 'holiday',
        name: h.name,
      });
    });

    return events;
  }
}
