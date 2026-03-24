import { Test, TestingModule } from '@nestjs/testing';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('PollsController', () => {
  let controller: PollsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollsController],
      providers: [
        {
          provide: PollsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({ id: 'poll-1' }),
            vote: jest.fn().mockResolvedValue({ success: true }),
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

    controller = module.get<PollsController>(PollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
