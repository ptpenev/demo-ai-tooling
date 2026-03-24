import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateLeaveStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['approved', 'rejected'])
  status!: string;

  @IsOptional()
  @IsString()
  approver_signature?: string;
}
