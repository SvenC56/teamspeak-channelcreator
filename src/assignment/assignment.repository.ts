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
    const {
      parent,
      codec,
      description,
      joinPower,
      max,
      min,
      prefix,
      quality,
      topic,
    } = createAssignmentInput;
    const date = new Date();

    const assignment = new Assignment();
    assignment.parent = parent;
    codec ? (assignment.codec = codec) : null;
    description ? (assignment.description = description) : null;
    joinPower ? (assignment.joinPower = joinPower) : null;
    max ? (assignment.max = max) : null;
    min ? (assignment.min = min) : null;
    prefix ? (assignment.prefix = prefix) : null;
    quality ? (assignment.quality = quality) : null;
    topic ? (assignment.topic = topic) : null;
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
    const {
      parent,
      codec,
      description,
      joinPower,
      max,
      min,
      prefix,
      quality,
      topic,
    } = updateAssignmentInput;

    const updatedAssignment = await this.findOne({ id });

    const date = new Date();

    parent ? (updatedAssignment.parent = parent) : null;
    codec ? (updatedAssignment.codec = codec) : null;
    description ? (updatedAssignment.description = description) : null;
    joinPower ? (updatedAssignment.joinPower = joinPower) : null;
    max ? (updatedAssignment.max = max) : null;
    min ? (updatedAssignment.min = min) : null;
    prefix ? (updatedAssignment.prefix = prefix) : null;
    quality ? (updatedAssignment.quality = quality) : null;
    topic ? (updatedAssignment.topic = topic) : null;

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
