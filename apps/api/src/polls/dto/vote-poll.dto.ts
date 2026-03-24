import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class VotePollDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  option_ids!: string[];
}
