import { forwardRef, Module } from '@nestjs/common';
import { TeamspeakService } from './teamspeak.service';
import { TeamspeakController } from './teamspeak.controller';
import { TeamspeakConfigModule } from 'src/config/teamspeak/config.module';
import { SyncModule } from 'src/sync/sync.module';

@Module({
  imports: [TeamspeakConfigModule, forwardRef(() => SyncModule)],
  providers: [TeamspeakService],
  controllers: [TeamspeakController],
  exports: [TeamspeakService],
})
export class TeamspeakModule {}
