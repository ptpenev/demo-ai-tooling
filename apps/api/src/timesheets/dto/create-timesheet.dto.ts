import { IsNotEmpty, IsUUID, IsNumber, IsString, IsIn, IsOptional, Max, Min, IsDateString } from 'class-validator';

export class CreateTimesheetDto {
  @IsNotEmpty()
  @IsUUID('all')
  project_id!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  @Max(24)
  hours!: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['working_time', 'overtime', 'day_off', 'client_agreement'])
  time_type!: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
