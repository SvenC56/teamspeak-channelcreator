import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetChannelByIdInput {
  @IsNumberString()
  @ApiProperty({ description: 'ID of the channel', required: true })
  cid: string;
}
