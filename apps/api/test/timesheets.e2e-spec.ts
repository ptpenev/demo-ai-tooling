import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { TimesheetsService } from './../src/timesheets/timesheets.service';
import { JwtService } from '@nestjs/jwt';

describe('TimesheetsController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let timesheetsService: TimesheetsService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(TimesheetsService)
    .useValue({
      findAll: jest.fn().mockResolvedValue([{ id: 'ts-1' }]),
      create: jest.fn().mockResolvedValue({ id: 'ts-1' }),
      update: jest.fn().mockResolvedValue({ id: 'ts-1' }),
      remove: jest.fn().mockResolvedValue({ success: true }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    timesheetsService = app.get<TimesheetsService>(TimesheetsService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/timesheets (GET) - returns timesheets', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/timesheets')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.data).toEqual([{ id: 'ts-1' }]);
  });

  it('/api/v1/timesheets (POST) - 403 if lack create permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .post('/api/v1/timesheets')
      .set('Authorization', `Bearer ${token}`)
      .send({ project_id: '123e4567-e89b-12d3-a456-426614174000', date: '2023-10-10', hours: 8, time_type: 'working_time' })
      .expect(403);
  });

  it('/api/v1/timesheets (POST) - 400 if validation fails (hours too high)', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'timesheet_entry', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .post('/api/v1/timesheets')
      .set('Authorization', `Bearer ${token}`)
      .send({ project_id: '123e4567-e89b-12d3-a456-426614174000', date: '2023-10-10', hours: 25, time_type: 'working_time' })
      .expect(400);
  });

  it('/api/v1/timesheets (POST) - 201 if valid', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'timesheet_entry', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/timesheets')
      .set('Authorization', `Bearer ${token}`)
      .send({ project_id: '123e4567-e89b-12d3-a456-426614174000', date: '2023-10-10', hours: 8, time_type: 'working_time' })
      .expect(201);
      
    expect(response.body.data).toEqual({ id: 'ts-1' });
  });
});
