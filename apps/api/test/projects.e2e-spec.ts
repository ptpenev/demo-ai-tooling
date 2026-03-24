import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { ProjectsService } from './../src/projects/projects.service';
import { JwtService } from '@nestjs/jwt';

describe('ProjectsController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let projectsService: ProjectsService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(ProjectsService)
    .useValue({
      findAllForUser: jest.fn().mockResolvedValue([{ id: 'proj-1' }]),
      create: jest.fn().mockResolvedValue({ id: 'proj-1' }),
      update: jest.fn().mockResolvedValue({ id: 'proj-1' }),
      assignMember: jest.fn().mockResolvedValue({ project_id: 'proj-1', user_id: 'user-1' }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    projectsService = app.get<ProjectsService>(ProjectsService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/projects (GET) - returns accessible projects', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]); // not admin, but service mock returns one project anyway
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body.data).toEqual([{ id: 'proj-1' }]);
  });

  it('/api/v1/projects (POST) - 403 if lack create permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Project' })
      .expect(403);
  });

  it('/api/v1/projects (POST) - 201 if has create permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'create', resource: 'project', scope: 'all' }
    ]);
    
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Project' })
      .expect(201);
      
    expect(response.body.data).toEqual({ id: 'proj-1' });
  });
});
