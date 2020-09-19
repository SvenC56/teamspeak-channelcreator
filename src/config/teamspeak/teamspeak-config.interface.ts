import { QueryProtocol } from './query-protocol.enum';

export interface TeamSpeakConfig {
  host: string;
  port: number;
  query_port: number;
  protocol: QueryProtocol;
  username: string;
  password: string;
  nickname: string;
}
