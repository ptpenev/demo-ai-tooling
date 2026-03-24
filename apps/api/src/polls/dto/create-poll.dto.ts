import { IsNotEmpty, IsString, IsBoolean, IsDateString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  question!: string;

  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;

  @IsOptional()
  @IsBoolean()
  allow_multiple?: boolean;

  @IsOptional()
  @IsString() // 'public', 'restricted'
  results_visibility?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  options!: string[];
}
