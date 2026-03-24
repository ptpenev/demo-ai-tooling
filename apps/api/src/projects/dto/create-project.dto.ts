import { IsNotEmpty, IsString, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'archived'])
  status?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
