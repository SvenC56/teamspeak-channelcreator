import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { Assignment } from './assignment.entity';
import { GetAssignmentInput } from './input/get-assignment.input';

@EntityRepository(Assignment)
export class AssignmentRepository extends Repository<Assignment> {
  async createAssignment(
    createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    const { name, shield, dcid, tsid } = createAssignmentInput;
    const date = new Date();

    const assignment = new Assignment();
    assignment.name = name;
    assignment.shield = shield;
    assignment.dcid = dcid;
    assignment.tsid = tsid;
    assignment.createdAt = date;
    assignment.updatedAt = null;

    try {
      await assignment.save();
    } catch (e) {
      this.errorHandler(e.code);
    }
    return assignment;
  }

  async updateAssignment(
    getAssignmentInput: GetAssignmentInput,
    updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    const { id } = getAssignmentInput;
    const { name, shield, dcid, tsid } = updateAssignmentInput;

    const updatedAssignment = await this.findOne({ id });

    const date = new Date();

    if (name) {
      updatedAssignment.name = name;
    }

    if (typeof shield === 'boolean') {
      updatedAssignment.shield = shield;
    }

    if (dcid) {
      updatedAssignment.dcid = dcid;
    }

    if (tsid) {
      updatedAssignment.tsid = tsid;
    }

    updatedAssignment.updatedAt = date;

    try {
      await this.update({ id }, updatedAssignment);
    } catch (e) {
      this.errorHandler(e.code);
    }

    return updatedAssignment;
  }

  async deleteAssignment(
    getAssignmentInput: GetAssignmentInput,
  ): Promise<DeleteResult> {
    const { id } = getAssignmentInput;
    return this.delete({ id });
  }

  private errorHandler(code) {
    switch (code) {
      case '23505':
        throw new ConflictException('name is already taken');
        break;

      default:
        throw new InternalServerErrorException();
        break;
    }
  }
}
