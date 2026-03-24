import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { DB_CONNECTION } from '../db/db.module';
import { UsersService } from '../users/users.service';

describe('CalendarService', () => {
  let service: CalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarService,
        {
          provide: DB_CONNECTION,
          useValue: {
            query: {
              project_members: { findMany: jest.fn().mockResolvedValue([]) },
            },
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            where: jest.fn().mockResolvedValue([]),
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

    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
