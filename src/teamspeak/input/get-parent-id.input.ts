import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetParentIdInput {
  @IsNumberString()
  @ApiProperty({ description: 'ID of the parent channel', required: true })
  pid: string;
}
