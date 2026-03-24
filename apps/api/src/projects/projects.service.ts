import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB_CONNECTION } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMemberDto } from './dto/assign-member.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
    private readonly usersService: UsersService,
  ) {}

  async findAllForUser(userId: string) {
    const permissions = await this.usersService.getUserPermissions(userId);
    const isAdmin = permissions.some(
      (p: any) => p.action === 'read' && p.resource === 'project' && p.scope === 'all'
    );

    if (isAdmin) {
      // Admins see all projects
      return await this.db.select().from(schema.projects);
    } else {
      // Standard users only see projects they are members of
      const memberProjects = await this.db
        .select({ project: schema.projects })
        .from(schema.projects)
        .innerJoin(schema.project_members, eq(schema.projects.id, schema.project_members.project_id))
        .where(eq(schema.project_members.user_id, userId));
      
      return memberProjects.map((row) => row.project);
    }
  }

  async create(createProjectDto: CreateProjectDto) {
    const [project] = await this.db
      .insert(schema.projects)
      .values({
        name: createProjectDto.name,
        description: createProjectDto.description,
        status: createProjectDto.status || 'active',
        start_date: createProjectDto.start_date ? new Date(createProjectDto.start_date) : null,
        end_date: createProjectDto.end_date ? new Date(createProjectDto.end_date) : null,
      })
      .returning();
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const valuesToUpdate: any = {};
    if (updateProjectDto.name !== undefined) valuesToUpdate.name = updateProjectDto.name;
    if (updateProjectDto.description !== undefined) valuesToUpdate.description = updateProjectDto.description;
    if (updateProjectDto.status !== undefined) valuesToUpdate.status = updateProjectDto.status;
    if (updateProjectDto.start_date !== undefined) valuesToUpdate.start_date = updateProjectDto.start_date ? new Date(updateProjectDto.start_date) : null;
    if (updateProjectDto.end_date !== undefined) valuesToUpdate.end_date = updateProjectDto.end_date ? new Date(updateProjectDto.end_date) : null;

    if (Object.keys(valuesToUpdate).length === 0) {
      const project = await this.db.query.projects.findFirst({
        where: eq(schema.projects.id, id),
      });
      if (!project) throw new NotFoundException('Project not found');
      return project;
    }

    const [updated] = await this.db
      .update(schema.projects)
      .set(valuesToUpdate)
      .where(eq(schema.projects.id, id))
      .returning();
    
    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async assignMember(projectId: string, assignMemberDto: AssignMemberDto) {
    const project = await this.db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
    });
    if (!project) throw new NotFoundException('Project not found');

    const user = await this.usersService.findById(assignMemberDto.user_id);
    if (!user) throw new NotFoundException('User not found');

    const existingMember = await this.db.query.project_members.findFirst({
      where: eq(schema.project_members.project_id, projectId) && eq(schema.project_members.user_id, assignMemberDto.user_id),
    });

    if (existingMember) {
      const [updated] = await this.db
        .update(schema.project_members)
        .set({ project_role: assignMemberDto.project_role })
        .where(eq(schema.project_members.project_id, projectId) && eq(schema.project_members.user_id, assignMemberDto.user_id))
        .returning();
      return updated;
    }

    const [member] = await this.db
      .insert(schema.project_members)
      .values({
        project_id: projectId,
        user_id: assignMemberDto.user_id,
        project_role: assignMemberDto.project_role,
      })
      .returning();
    
    return member;
  }
}
