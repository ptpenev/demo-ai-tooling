import { Test, TestingModule } from '@nestjs/testing';
import { LeavesService } from './leaves.service';
import { DB_CONNECTION } from '../db/db.module';
import { UsersService } from '../users/users.service';

describe('LeavesService', () => {
  let service: LeavesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeavesService,
        {
          provide: DB_CONNECTION,
          useValue: {
            query: {
              leave_types: { findFirst: jest.fn().mockResolvedValue({ id: 'paid-1', name: 'paid' }) },
              leave_requests: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn().mockResolvedValue(null) },
            },
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserPermissions: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue(null),
          },
        }
      ],
    }).compile();

    service = module.get<LeavesService>(LeavesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
