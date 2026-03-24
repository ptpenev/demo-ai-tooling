import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { UsersService } from '../users/users.service';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserPermissions: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
