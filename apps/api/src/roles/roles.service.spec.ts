import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { DB_CONNECTION } from '../db/db.module';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: DB_CONNECTION,
          useValue: {
            query: {
              roles: { findMany: jest.fn().mockResolvedValue([]) },
            },
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
