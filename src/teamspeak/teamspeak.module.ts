import { Module } from '@nestjs/common';
import { TeamspeakService } from './teamspeak.service';
import { TeamspeakController } from './teamspeak.controller';
import { TeamspeakConfigModule } from 'src/config/teamspeak/config.module';

@Module({
  imports: [TeamspeakConfigModule],
  providers: [TeamspeakService],
  controllers: [TeamspeakController],
  exports: [TeamspeakService],
})
export class TeamspeakModule {}
