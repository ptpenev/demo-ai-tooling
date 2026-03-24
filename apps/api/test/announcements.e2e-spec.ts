import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { AnnouncementsService } from './../src/announcements/announcements.service';
import { JwtService } from '@nestjs/jwt';

describe('AnnouncementsController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let announcementsService: AnnouncementsService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(AnnouncementsService)
    .useValue({
      findAllForUser: jest.fn().mockResolvedValue([{ id: 'ann-1', title: 'Hello' }]),
      create: jest.fn().mockResolvedValue({ id: 'ann-2', title: 'Test' }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    announcementsService = app.get<AnnouncementsService>(AnnouncementsService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/announcements (GET) - 200 returns announcements for user', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]); // no special perms needed for GET as long as authenticated
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/announcements')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.data).toEqual([{ id: 'ann-1', title: 'Hello' }]);
  });

  it('/api/v1/announcements (POST) - 403 if lack create permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .post('/api/v1/announcements')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'Test', targets: [{ target_type: 'all' }] })
      .expect(403);
  });

  it('/api/v1/announcements (POST) - 201 creates announcement', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'announcement', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/announcements')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'Test', targets: [{ target_type: 'all' }] })
      .expect(201);
      
    expect(response.body.data).toEqual({ id: 'ann-2', title: 'Test' });
  });
});
