import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsUUID('all', { each: true })
  permission_ids!: string[];
}
