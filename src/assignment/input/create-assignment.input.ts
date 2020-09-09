import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAssignmentInput {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  name: string;

  @IsBoolean()
  @ApiProperty({ default: false })
  shield: boolean;

  @IsNumber()
  @ApiProperty()
  tsid: number;

  @IsNumber()
  @ApiProperty()
  dcid: number;
}
