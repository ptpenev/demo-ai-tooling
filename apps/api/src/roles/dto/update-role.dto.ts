import { IsArray, IsUUID } from 'class-validator';

export class UpdateRoleDto {
  @IsArray()
  @IsUUID('all', { each: true })
  permission_ids!: string[];
}
