import { Module } from '@nestjs/common';
import configuration from './configuration';
import { DatabaseConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Import and provide database configuration related classes.
 *
 * @export
 * @class DatabaseConfigModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
