import { Test, TestingModule } from '@nestjs/testing';
import { AnnouncementsService } from './announcements.service';
import { DB_CONNECTION } from '../db/db.module';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: DB_CONNECTION,
          useValue: {
            query: {
              project_members: { findMany: jest.fn().mockResolvedValue([]) },
              announcement_targets: { findMany: jest.fn().mockResolvedValue([]) },
              announcements: { findMany: jest.fn().mockResolvedValue([]) },
            },
            transaction: jest.fn().mockResolvedValue({ id: 'ann-1' }),
          },
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
