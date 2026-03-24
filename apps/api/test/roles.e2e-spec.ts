import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { RolesService } from './../src/roles/roles.service';
import { JwtService } from '@nestjs/jwt';

describe('RolesController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let rolesService: RolesService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(RolesService)
    .useValue({
      findAll: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: 'role-1' }),
      update: jest.fn().mockResolvedValue({ id: 'role-1' }),
    })
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usersService = app.get<UsersService>(UsersService);
    rolesService = app.get<RolesService>(RolesService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/roles (GET) - 401 if not logged in', () => {
    return request(app.getHttpServer())
      .get('/api/v1/roles')
      .expect(401);
  });

  it('/api/v1/roles (GET) - 403 if lack admin/read permission', async () => {
    // We mock getUserPermissions to return empty
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([]);

    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    return request(app.getHttpServer())
      .get('/api/v1/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('/api/v1/roles (GET) - 200 if has permission', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'read', resource: 'role', scope: 'all' }
    ]);
    
    // We mock the DB for the roles query
    // To do it properly in E2E we'd normally seed the DB or mock the DB connection, but for time
    // we'll let it hit the dev DB, which should return 200 [] if empty, or we can mock RolesService.
    const token = jwtService.sign({ email: 'test@test.com', sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .get('/api/v1/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      
    expect(response.body).toHaveProperty('data');
  });
  
  it('/api/v1/users/:id/roles (POST) - assigns role and returns 201', async () => {
    jest.spyOn(usersService, 'findById').mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any);
    jest.spyOn(usersService, 'getUserPermissions').mockResolvedValue([
      { action: 'update', resource: 'user_roles', scope: 'all' }
    ]);
    
    // Mock the assignment
    jest.spyOn(usersService, 'assignRole').mockResolvedValue({ user_id: 'user-1', role_id: '123e4567-e89b-12d3-a456-426614174000', project_id: null } as any);

    const token = jwtService.sign({ email: 'test@test.com', sub: 'admin-1' });

    const response = await request(app.getHttpServer())
      .post('/api/v1/users/user-1/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({ role_id: '123e4567-e89b-12d3-a456-426614174000' })
      .expect(201);
      
    expect(response.body.data.role_id).toBe('123e4567-e89b-12d3-a456-426614174000');
  });
});
