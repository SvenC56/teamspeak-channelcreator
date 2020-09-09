import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { GetAssignmentInput } from './input/get-assignment.input';
import { Assignment } from './assignment.entity';
import { AssignmentService } from './assignment.service';
import { DeleteResult } from 'typeorm';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create assignment' })
  @ApiTags('assignment')
  @ApiResponse({
    type: Assignment,
  })
  createAssignment(
    @Body() createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.createAssignment(createAssignmentInput);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assignment' })
  @ApiTags('assignment')
  @ApiResponse({
    type: Assignment,
  })
  updateAssignment(
    @Param() getAssignmentInput: GetAssignmentInput,
    @Body() updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.updateAssignment(
      getAssignmentInput,
      updateAssignmentInput,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiTags('assignment')
  getAssignments(): Promise<Assignment[]> {
    return this.assignmentService.getAssignments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single assignment by ID' })
  @ApiTags('assignment')
  @ApiResponse({
    type: Assignment,
  })
  getAssignment(
    @Param() getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.getAssignment(getAssignmentInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete single assignment by ID' })
  @ApiTags('assignment')
  deleteAssignment(
    @Param() getAssignmentInput: GetAssignmentInput,
  ): Promise<DeleteResult> {
    return this.assignmentService.deleteAssignment(getAssignmentInput);
  }
}
