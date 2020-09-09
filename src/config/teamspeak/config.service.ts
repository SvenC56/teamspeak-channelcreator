import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryProtocol } from './query-protocol.enum';
import { TeamSpeakConfig } from './teamspeak-config.interface';

/**
 * Service dealing with teamspeak config based operations.
 *
 * @export
 * @class TeamspeakConfigService
 */
@Injectable()
export class TeamspeakConfigService {
  constructor(private configService: ConfigService) {}

  get serverPort(): number {
    return this.configService.get<number>('teamspeak.port');
  }

  get nickname(): string {
    return this.configService.get<string>('teamspeak.bot_name');
  }

  get config(): TeamSpeakConfig {
    return {
      host: this.configService.get<string>('teamspeak.host'),
      query_port: this.configService.get<number>('teamspeak.query_port'),
      port: this.configService.get<number>('teamspeak.port'),
      protocol: this.configService.get<QueryProtocol>('teamspeak.protocol'),
      username: this.configService.get<string>('teamspeak.user'),
      password: this.configService.get<string>('teamspeak.password'),
      nickname: this.configService.get<string>('teamspeak.bot_name'),
    };
  }
}
