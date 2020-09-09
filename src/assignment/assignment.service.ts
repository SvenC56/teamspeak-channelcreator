import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { GetAssignmentInput } from './input/get-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { Assignment } from './assignment.entity';
import { AssignmentRepository } from './assignment.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AssignmentService {
  private readonly logger = new Logger(AssignmentService.name);

  constructor(
    @InjectRepository(AssignmentRepository)
    private readonly assignmentRepository: AssignmentRepository,
  ) {}

  async createAssignment(
    createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentRepository.createAssignment(createAssignmentInput);
  }

  async updateAssignment(
    getAssignmentInput: GetAssignmentInput,
    updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentRepository.updateAssignment(
      getAssignmentInput,
      updateAssignmentInput,
    );
  }

  async getAssignments(): Promise<Assignment[]> {
    return this.assignmentRepository.find();
  }

  async getAssignment(
    getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    const { id } = getAssignmentInput;
    return this.assignmentRepository.findOne(+id);
  }

  async deleteAssignment(
    getAssignmentInput: GetAssignmentInput,
  ): Promise<DeleteResult> {
    return this.assignmentRepository.deleteAssignment(getAssignmentInput);
  }
}
