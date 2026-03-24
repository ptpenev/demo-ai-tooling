import { IsNotEmpty, IsString, IsDateString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnnouncementTargetDto {
  @IsNotEmpty()
  @IsString()
  target_type!: string; // 'all', 'team', 'project', 'user'

  @IsOptional()
  @IsString()
  target_id?: string;
}

export class CreateAnnouncementDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @IsOptional()
  @IsDateString()
  valid_to?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnouncementTargetDto)
  targets?: AnnouncementTargetDto[];
}
