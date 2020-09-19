import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetAssignmentInput {
  @IsNumberString()
  @ApiProperty({ description: 'ID of the assignment', required: true })
  id: number;
}
