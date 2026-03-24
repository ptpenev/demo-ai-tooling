import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { CalendarService } from './../src/calendar/calendar.service';
import { JwtService } from '@nestjs/jwt';

describe('CalendarController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let calendarService: CalendarService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(CalendarService)
    .useValue({
      getAggregatedCalendar: jest.fn().mockResolvedValue([
        { date: '2026-01-01', type: 'holiday', name: "New Year's Day" }
      ]),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    calendarService = app.get<CalendarService>(CalendarService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/calendar (GET) - 200 returns events', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'read', resource: 'calendar', scope: 'own' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/calendar?start_date=2026-01-01&end_date=2026-01-31')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.data).toEqual([
      { date: '2026-01-01', type: 'holiday', name: "New Year's Day" }
    ]);
  });

  it('/api/v1/calendar (GET) - 400 if missing dates', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'read', resource: 'calendar', scope: 'own' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .get('/api/v1/calendar')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('/api/v1/calendar (GET) - 403 if lack permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .get('/api/v1/calendar?start_date=2026-01-01&end_date=2026-01-31')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
