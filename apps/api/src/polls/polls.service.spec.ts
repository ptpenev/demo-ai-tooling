import { Test, TestingModule } from '@nestjs/testing';
import { PollsService } from './polls.service';
import { DB_CONNECTION } from '../db/db.module';

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsService,
        {
          provide: DB_CONNECTION,
          useValue: {
            query: {
              polls: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn().mockResolvedValue(null) },
              poll_options: { findMany: jest.fn().mockResolvedValue([]) },
              poll_votes: { findFirst: jest.fn().mockResolvedValue(null) },
            },
            transaction: jest.fn().mockResolvedValue({ id: 'poll-1' }),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
