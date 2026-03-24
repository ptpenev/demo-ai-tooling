import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { eq, and, gte, lte, inArray, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TimesheetsService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, createTimesheetDto: CreateTimesheetDto) {
    const isMember = await this.db.query.project_members.findFirst({
      where: and(
        eq(schema.project_members.project_id, createTimesheetDto.project_id),
        eq(schema.project_members.user_id, userId)
      ),
    });

    if (!isMember) {
      throw new ForbiddenException('User is not a member of the specified project');
    }

    const [timesheet] = await this.db
      .insert(schema.timesheet_entries)
      .values({
        user_id: userId,
        project_id: createTimesheetDto.project_id,
        date: createTimesheetDto.date,
        hours: createTimesheetDto.hours.toString() as any,
        time_type: createTimesheetDto.time_type,
        comment: createTimesheetDto.comment || null,
        is_approved: false,
      })
      .returning();

    return timesheet;
  }

  async findAll(userId: string, queryParams: { start_date?: string; end_date?: string; project_id?: string; user_id?: string }) {
    const permissions = await this.usersService.getUserPermissions(userId);

    const canReadAll = permissions.some((p: any) => p.action === 'read' && p.resource === 'timesheet' && p.scope === 'all');
    const canReadProject = permissions.some((p: any) => p.action === 'read' && p.resource === 'timesheet' && p.scope === 'project');
    const canReadTeam = permissions.some((p: any) => p.action === 'read' && p.resource === 'timesheet' && p.scope === 'team');

    let conditions: any[] = [];

    if (!canReadAll) {
      if (canReadProject || canReadTeam) {
        const managedProjects = await this.db.query.project_members.findMany({
          where: and(
            eq(schema.project_members.user_id, userId),
            inArray(schema.project_members.project_role, ['manager', 'lead'])
          ),
        });

        const managedProjectIds = managedProjects.map((mp) => mp.project_id);

        if (managedProjectIds.length > 0) {
          conditions.push(
            or(
              eq(schema.timesheet_entries.user_id, userId),
              inArray(schema.timesheet_entries.project_id, managedProjectIds)
            )
          );
        } else {
          conditions.push(eq(schema.timesheet_entries.user_id, userId));
        }
      } else {
        conditions.push(eq(schema.timesheet_entries.user_id, userId));
      }
    }

    if (queryParams.user_id) {
      conditions.push(eq(schema.timesheet_entries.user_id, queryParams.user_id));
    }
    if (queryParams.project_id) {
      conditions.push(eq(schema.timesheet_entries.project_id, queryParams.project_id));
    }
    if (queryParams.start_date) {
      conditions.push(gte(schema.timesheet_entries.date, queryParams.start_date));
    }
    if (queryParams.end_date) {
      conditions.push(lte(schema.timesheet_entries.date, queryParams.end_date));
    }

    const timesheets = await this.db.query.timesheet_entries.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
    });

    return timesheets;
  }

  async update(id: string, userId: string, updateTimesheetDto: UpdateTimesheetDto) {
    const timesheet = await this.db.query.timesheet_entries.findFirst({
      where: eq(schema.timesheet_entries.id, id),
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet entry not found');
    }

    if (timesheet.user_id !== userId) {
      throw new ForbiddenException('You can only edit your own timesheets');
    }

    if (timesheet.is_approved) {
      throw new BadRequestException('Cannot edit an approved timesheet');
    }

    const valuesToUpdate: any = {};
    if (updateTimesheetDto.date !== undefined) valuesToUpdate.date = updateTimesheetDto.date;
    if (updateTimesheetDto.hours !== undefined) valuesToUpdate.hours = updateTimesheetDto.hours.toString();
    if (updateTimesheetDto.time_type !== undefined) valuesToUpdate.time_type = updateTimesheetDto.time_type;
    if (updateTimesheetDto.comment !== undefined) valuesToUpdate.comment = updateTimesheetDto.comment;

    if (Object.keys(valuesToUpdate).length === 0) {
      return timesheet;
    }

    const [updated] = await this.db
      .update(schema.timesheet_entries)
      .set(valuesToUpdate)
      .where(eq(schema.timesheet_entries.id, id))
      .returning();

    return updated;
  }

  async remove(id: string, userId: string) {
    const timesheet = await this.db.query.timesheet_entries.findFirst({
      where: eq(schema.timesheet_entries.id, id),
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet entry not found');
    }

    if (timesheet.user_id !== userId) {
      throw new ForbiddenException('You can only delete your own timesheets');
    }

    if (timesheet.is_approved) {
      throw new BadRequestException('Cannot delete an approved timesheet');
    }

    await this.db.delete(schema.timesheet_entries).where(eq(schema.timesheet_entries.id, id));
    return { success: true };
  }
}
