import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateAssignmentInput {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({ required: false })
  name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  shield?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  tsid?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  dcid?: number;
}
