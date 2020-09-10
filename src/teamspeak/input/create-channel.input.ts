import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ChannelEdit } from 'ts3-nodejs-library/lib/types/PropertyTypes';
import { Permission } from 'ts3-nodejs-library/lib/util/Permission';

export class CreateChannelInput {
  @IsString()
  @ApiProperty({ description: 'Name of the new channel', required: true })
  name: string;

  @ValidateNested()
  @IsOptional()
  @ApiProperty({
    description: 'Properties for the new channel',
    required: false,
  })
  properties?: ChannelEdit;

  @ValidateNested({ each: true })
  @IsOptional()
  @ApiProperty({ description: 'Perms for the new channel', required: false })
  perms?: Permission.PermType[];
}
