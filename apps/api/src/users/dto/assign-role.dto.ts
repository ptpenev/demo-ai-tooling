import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsUUID('all')
  role_id!: string;

  @IsOptional()
  @IsUUID('all')
  project_id?: string;
}
