import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Codec } from 'ts3-nodejs-library';

export class UpdateAssignmentInput {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  parent?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  prefix?: string;

  @IsNumber()
  @Min(1)
  @Max(99)
  @IsOptional()
  @ApiProperty({ required: false, minimum: 1, maximum: 99, default: 1 })
  min?: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  @IsOptional()
  @ApiProperty({ required: false, minimum: 0, maximum: 99, default: 0 })
  max?: number;

  @IsEnum(Codec)
  @IsOptional()
  @ApiProperty({ required: false, default: Codec.OPUS_VOICE, enum: Codec })
  codec?: Codec;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  @ApiProperty({ required: false, minimum: 1, maximum: 10, default: 5 })
  quality?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @ApiProperty({ required: false, minimum: 0, maximum: 100, default: 0 })
  joinPower?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  topic?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
