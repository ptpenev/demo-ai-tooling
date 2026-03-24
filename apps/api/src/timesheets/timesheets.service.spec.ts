import { Test, TestingModule } from '@nestjs/testing';
import { TimesheetsService } from './timesheets.service';
import { DB_CONNECTION } from '../db/db.module';
import { UsersService } from '../users/users.service';

describe('TimesheetsService', () => {
  let service: TimesheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimesheetsService,
        {
          provide: DB_CONNECTION,
          useValue: {
            query: {
              project_members: { findFirst: jest.fn().mockResolvedValue(null), findMany: jest.fn().mockResolvedValue([]) },
              timesheet_entries: { findFirst: jest.fn().mockResolvedValue(null), findMany: jest.fn().mockResolvedValue([]) },
            },
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            returning: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserPermissions: jest.fn().mockResolvedValue([]),
          },
        }
      ],
    }).compile();

    service = module.get<TimesheetsService>(TimesheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
