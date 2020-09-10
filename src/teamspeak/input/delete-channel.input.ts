import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { GetChannelByIdInput } from './get-channel-by-id.input';

export class DeleteChannelInput extends GetChannelByIdInput {
  @IsBoolean()
  @ApiProperty({
    description: 'Force delete the channel?',
    required: false,
    default: false,
  })
  force?: boolean;
}
