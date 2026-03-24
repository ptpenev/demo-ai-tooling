import { IsNotEmpty, IsDateString, IsOptional, IsIn, IsUUID } from 'class-validator';

export class GetCalendarDto {
  @IsNotEmpty()
  @IsDateString()
  start_date!: string;

  @IsNotEmpty()
  @IsDateString()
  end_date!: string;

  @IsOptional()
  @IsIn(['own', 'team', 'project', 'all'])
  scope?: string;

  @IsOptional()
  @IsUUID('all')
  project_id?: string;

  @IsOptional()
  @IsUUID('all')
  user_id?: string;
}
