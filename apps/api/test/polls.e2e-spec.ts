import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { PollsService } from './../src/polls/polls.service';
import { JwtService } from '@nestjs/jwt';

describe('PollsController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let pollsService: PollsService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PollsService)
    .useValue({
      findAll: jest.fn().mockResolvedValue([{ id: 'poll-1', question: 'Q?' }]),
      create: jest.fn().mockResolvedValue({ id: 'poll-2', question: 'Test?' }),
      vote: jest.fn().mockResolvedValue({ success: true }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    pollsService = app.get<PollsService>(PollsService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/polls (GET) - returns active polls', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'read', resource: 'poll', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/polls')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.data).toEqual([{ id: 'poll-1', question: 'Q?' }]);
  });

  it('/api/v1/polls (POST) - 403 if lack create permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .post('/api/v1/polls')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'Test?', options: ['A', 'B'] })
      .expect(403);
  });

  it('/api/v1/polls (POST) - 201 creates poll', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'poll', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/polls')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'Test?', options: ['A', 'B'] })
      .expect(201);
      
    expect(response.body.data).toEqual({ id: 'poll-2', question: 'Test?' });
  });

  it('/api/v1/polls/:id/vote (POST) - casts vote anonymously', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'poll_vote', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/polls/poll-1/vote')
      .set('Authorization', `Bearer ${token}`)
      .send({ option_ids: ['123e4567-e89b-12d3-a456-426614174000'] })
      .expect(201);
      
    expect(response.body.data).toEqual({ success: true });
  });
});
