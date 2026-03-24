import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findAllForUser: jest.fn().mockResolvedValue([{ id: 'p1', name: 'Project 1' }]),
            create: jest.fn().mockResolvedValue({ id: 'p2', name: 'Project 2' }),
            update: jest.fn().mockResolvedValue({ id: 'p1', name: 'Updated Project' }),
            assignMember: jest.fn().mockResolvedValue({ project_id: 'p1', user_id: 'u1' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserPermissions: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(PermissionsGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should findAll projects for a user', async () => {
    const res = await controller.findAll({ user: { id: 'u1' } });
    expect(res.data).toEqual([{ id: 'p1', name: 'Project 1' }]);
    expect(service.findAllForUser).toHaveBeenCalledWith('u1');
  });

  it('should create a project', async () => {
    const res = await controller.create({ name: 'Project 2' });
    expect(res.data).toEqual({ id: 'p2', name: 'Project 2' });
  });

  it('should update a project', async () => {
    const res = await controller.update('p1', { name: 'Updated Project' });
    expect(res.data).toEqual({ id: 'p1', name: 'Updated Project' });
  });

  it('should assign a member', async () => {
    const res = await controller.assignMember('p1', { user_id: 'u1', project_role: 'member' });
    expect(res.data).toEqual({ project_id: 'p1', user_id: 'u1' });
  });
});
