import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetsController } from './timesheets.controller';
import { TimesheetsService } from './timesheets.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('TimesheetsController', () => {
  let controller: TimesheetsController;
  let service: TimesheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimesheetsController],
      providers: [
        {
          provide: TimesheetsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: 'ts-1' }]),
            create: jest.fn().mockResolvedValue({ id: 'ts-2' }),
            update: jest.fn().mockResolvedValue({ id: 'ts-1', comment: 'Updated' }),
            remove: jest.fn().mockResolvedValue({ success: true }),
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

    controller = module.get<TimesheetsController>(TimesheetsController);
    service = module.get<TimesheetsService>(TimesheetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAll', async () => {
    const res = await controller.findAll({ user: { id: 'u1' } }, {});
    expect(res.data).toEqual([{ id: 'ts-1' }]);
  });

  it('should create', async () => {
    const res = await controller.create({ user: { id: 'u1' } }, { project_id: 'p1', date: '2023-10-10', hours: 8, time_type: 'working_time' });
    expect(res.data).toEqual({ id: 'ts-2' });
  });

  it('should update', async () => {
    const res = await controller.update({ user: { id: 'u1' } }, 'ts-1', { comment: 'Updated' });
    expect(res.data).toEqual({ id: 'ts-1', comment: 'Updated' });
  });

  it('should remove', async () => {
    const res = await controller.remove({ user: { id: 'u1' } }, 'ts-1');
    expect(res.data).toEqual({ success: true });
  });
});
