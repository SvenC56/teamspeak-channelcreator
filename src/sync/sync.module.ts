import { forwardRef, Module } from '@nestjs/common';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { TeamspeakModule } from 'src/teamspeak/teamspeak.module';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [AssignmentModule, forwardRef(() => TeamspeakModule)],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}
