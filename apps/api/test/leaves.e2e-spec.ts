import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { LeavesService } from './../src/leaves/leaves.service';
import { JwtService } from '@nestjs/jwt';

describe('LeavesController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let leavesService: LeavesService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(LeavesService)
    .useValue({
      findAll: jest.fn().mockResolvedValue({ requests: [], balance: 20 }),
      submitLeaveRequest: jest.fn().mockResolvedValue({ id: 'leave-1' }),
      updateStatus: jest.fn().mockResolvedValue({ id: 'leave-1', status: 'approved' }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    leavesService = app.get<LeavesService>(LeavesService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/leaves (GET) - 200 returns requests and balance', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'read', resource: 'leave_request', scope: 'own' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/leaves')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.data).toEqual({ requests: [], balance: 20 });
  });

  it('/api/v1/leaves (POST) - 201 creates leave', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'leave_request', scope: 'own' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/leaves')
      .set('Authorization', `Bearer ${token}`)
      .send({ leave_type_id: '123e4567-e89b-12d3-a456-426614174000', start_date: '2023-10-10', end_date: '2023-10-12', days: 3 })
      .expect(201);
      
    expect(response.body.data).toEqual({ id: 'leave-1' });
  });

  it('/api/v1/leaves/:id/status (PATCH) - 403 if lack approve permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .patch('/api/v1/leaves/leave-1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' })
      .expect(403);
  });

  it('/api/v1/leaves/:id/status (PATCH) - 200 if valid', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'approve', resource: 'leave_request', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .patch('/api/v1/leaves/leave-1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' })
      .expect(200);
      
    expect(response.body.data).toEqual({ id: 'leave-1', status: 'approved' });
  });
});
