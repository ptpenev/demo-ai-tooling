import { IsNotEmpty, IsUUID, IsIn } from 'class-validator';

export class AssignMemberDto {
  @IsNotEmpty()
  @IsUUID('all')
  user_id!: string;

  @IsNotEmpty()
  @IsIn(['manager', 'lead', 'member'])
  project_role!: string;
}
