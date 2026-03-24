import { IsNotEmpty, IsUUID, IsNumber, IsIn, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsNotEmpty()
  @IsUUID('all')
  leave_type_id!: string;

  @IsNotEmpty()
  @IsDateString()
  start_date!: string;

  @IsNotEmpty()
  @IsDateString()
  end_date!: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  days!: number;

  @IsOptional()
  @IsString()
  requester_signature?: string;
}
