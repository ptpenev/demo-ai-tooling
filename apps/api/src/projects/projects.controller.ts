import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMemberDto } from './dto/assign-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Controller('api/v1/projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req: any) {
    const projects = await this.projectsService.findAllForUser(req.user.id);
    return {
      data: projects,
      meta: {},
      errors: [],
    };
  }

  @Post()
  @RequirePermission('create', 'project', 'all')
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.create(createProjectDto);
    return {
      data: project,
      meta: {},
      errors: [],
    };
  }

  @Patch(':id')
  @RequirePermission('update', 'project', 'all')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    const project = await this.projectsService.update(id, updateProjectDto);
    return {
      data: project,
      meta: {},
      errors: [],
    };
  }

  @Post(':id/members')
  @RequirePermission('update', 'project_members', 'all')
  async assignMember(@Param('id') id: string, @Body() assignMemberDto: AssignMemberDto) {
    const member = await this.projectsService.assignMember(id, assignMemberDto);
    return {
      data: member,
      meta: {},
      errors: [],
    };
  }
}
