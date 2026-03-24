import { IsOptional, IsNumber, IsString, IsIn, Max, Min, IsDateString } from 'class-validator';

export class UpdateTimesheetDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  @Max(24)
  hours?: number;

  @IsOptional()
  @IsString()
  @IsIn(['working_time', 'overtime', 'day_off', 'client_agreement'])
  time_type?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
