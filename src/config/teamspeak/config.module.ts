import { Module } from '@nestjs/common';
import configuration from './configuration';
import { TeamspeakConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Import and provide teamspeak configuration related classes.
 *
 * @export
 * @class TeamspeakConfigModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, TeamspeakConfigService],
  exports: [TeamspeakConfigService],
})
export class TeamspeakConfigModule {}
