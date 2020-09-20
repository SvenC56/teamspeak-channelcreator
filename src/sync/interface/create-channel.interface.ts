import { Assignment } from 'src/assignment/assignment.entity';

export interface CreateChannel {
  channelName: string;
  assignment: Assignment;
}
