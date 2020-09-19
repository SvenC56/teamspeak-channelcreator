import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with database config based operations.
 *
 * @export
 * @class DatabaseConfigService
 * @implements {TypeOrmOptionsFactory}
 */
@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  /**
   * return TypeORM options
   *
   * @returns {TypeOrmModuleOptions}
   * @memberof DatabaseConfigService
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const type = this.configService.get<string>('database.type');
    if (type === 'mysql' || type === 'postgres') {
      return {
        type: type,
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('database.name'),
        synchronize: this.configService.get<string>('app.env') !== 'production',
        logging: this.configService.get<boolean>('app.debug'),
        entities: this.configService.get<[string]>('database.entities'),
        migrations: [__dirname + '/../../database/migrations-mysql/*.{js,ts}'],
        subscribers: [__dirname + '/../../database/subscriber-mysql/*.{js,ts}'],
        migrationsRun:
          this.configService.get<string>('app.env') === 'production',
      };
    } else {
      return {
        type: 'sqlite',
        database: __dirname + '/../../../database/database.db',
        synchronize: this.configService.get<string>('app.env') !== 'production',
        logging: this.configService.get<boolean>('app.debug'),
        entities: this.configService.get<[string]>('database.entities'),
        migrations: [__dirname + '/../../database/migrations-sqlite/*.{js,ts}'],
        subscribers: [
          __dirname + '/../../database/subscriber-sqlite/*.{js,ts}',
        ],
        migrationsRun:
          this.configService.get<string>('app.env') === 'production',
      };
    }
  }
}
