import { Test, TestingModule } from '@nestjs/testing';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('LeavesController', () => {
  let controller: LeavesController;
  let service: LeavesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeavesController],
      providers: [
        {
          provide: LeavesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({ requests: [], balance: 20 }),
            submitLeaveRequest: jest.fn().mockResolvedValue({ id: 'leave-1' }),
            updateStatus: jest.fn().mockResolvedValue({ id: 'leave-1', status: 'approved' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserPermissions: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(PermissionsGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<LeavesController>(LeavesController);
    service = module.get<LeavesService>(LeavesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get leaves and balance', async () => {
    const res = await controller.findAll({ user: { id: 'u1' } });
    expect(res.data).toEqual({ requests: [], balance: 20 });
  });

  it('should create leave request', async () => {
    const res = await controller.create({ user: { id: 'u1' } }, { leave_type_id: 'type-1', start_date: '2023-10-10', end_date: '2023-10-12', days: 3 });
    expect(res.data).toEqual({ id: 'leave-1' });
  });

  it('should update leave status', async () => {
    const res = await controller.updateStatus({ user: { id: 'u2' } }, 'leave-1', { status: 'approved' });
    expect(res.data).toEqual({ id: 'leave-1', status: 'approved' });
  });
});
