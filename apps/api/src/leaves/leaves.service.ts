import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateLeaveRequestDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeavesService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async calculateLeaveBalance(userId: string) {
    const TOTAL_ANNUAL_PAID_LEAVE = 20;

    const leaveType = await this.db.query.leave_types.findFirst({
      where: eq(schema.leave_types.name, 'paid'),
    });

    if (!leaveType) {
      return TOTAL_ANNUAL_PAID_LEAVE;
    }

    const approvedPaidLeaves = await this.db.query.leave_requests.findMany({
      where: and(
        eq(schema.leave_requests.user_id, userId),
        eq(schema.leave_requests.leave_type_id, leaveType.id),
        eq(schema.leave_requests.status, 'approved'),
      ),
    });

    const usedDays = approvedPaidLeaves.reduce((sum, request) => sum + parseFloat(request.days as any), 0);
    return Math.max(TOTAL_ANNUAL_PAID_LEAVE - usedDays, 0);
  }

  async submitLeaveRequest(userId: string, createDto: CreateLeaveRequestDto) {
    const leaveType = await this.db.query.leave_types.findFirst({
      where: eq(schema.leave_types.id, createDto.leave_type_id),
    });

    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    if (leaveType.name === 'paid') {
      const remainingBalance = await this.calculateLeaveBalance(userId);
      if (createDto.days > remainingBalance) {
        throw new BadRequestException(`Insufficient paid leave balance. Remaining: ${remainingBalance} days.`);
      }
    }

    const [request] = await this.db
      .insert(schema.leave_requests)
      .values({
        user_id: userId,
        leave_type_id: createDto.leave_type_id,
        start_date: createDto.start_date,
        end_date: createDto.end_date,
        days: createDto.days.toString() as any,
        status: 'pending',
        requester_signature: createDto.requester_signature || null,
      })
      .returning();

    return request;
  }

  async findAll(userId: string, targetUserId?: string) {
    const queryUserId = targetUserId || userId;

    const requests = await this.db.query.leave_requests.findMany({
      where: eq(schema.leave_requests.user_id, queryUserId),
    });

    const balance = await this.calculateLeaveBalance(queryUserId);

    return {
      requests,
      balance,
    };
  }

  async updateStatus(id: string, approverId: string, updateDto: UpdateLeaveStatusDto) {
    const request = await this.db.query.leave_requests.findFirst({
      where: eq(schema.leave_requests.id, id),
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    if (request.user_id === approverId) {
      throw new ForbiddenException('You cannot approve or reject your own leave request');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException('Leave request is already processed');
    }

    const [updated] = await this.db
      .update(schema.leave_requests)
      .set({
        status: updateDto.status,
        approver_id: approverId,
        approver_signature: updateDto.approver_signature || null,
      })
      .where(eq(schema.leave_requests.id, id))
      .returning();

    return updated;
  }
}
