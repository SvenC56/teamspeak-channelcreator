import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { TeamspeakConfigService } from 'src/config/teamspeak/config.service';
// TeamSpeak
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
  TeamSpeakServerGroup,
} from 'ts3-nodejs-library';
import {
  InstanceInfo,
  ServerInfo,
  Whoami,
} from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { GetParentIdInput } from './input/get-parent-id.input';

@Injectable()
export class TeamspeakService {
  private readonly logger = new Logger(TeamspeakService.name);

  private teamspeak: TeamSpeak;
  constructor(private readonly teamspeakConfig: TeamspeakConfigService) {
    this.teamspeak = new TeamSpeak(teamspeakConfig.config);

    this.teamspeak.on('close', async () => {
      await this.teamspeak.reconnect(-1, 1000);
    });

    this.teamspeak.on('error', (e) => {
      switch (true) {
        case /^could not fetch client/.test(e.message): {
          this.logger.debug(e.message);
          break;
        }
        default: {
          this.logger.error(e.message);
          break;
        }
      }
    });

    // this.teamspeak.on('debug', (event) => {
    //   this.logger.debug(event);
    // });

    this.teamspeak.on('ready', async () => {
      this.logger.log('Connected to TeamSpeak Server!');
      await this.teamspeak.useByPort(
        teamspeakConfig.serverPort,
        teamspeakConfig.nickname,
      );

      await Promise.all([this.teamspeak.registerEvent('server')]);

      this.teamspeak.on('clientconnect', async (event) => {});
    });
  }

  async getWhoami(): Promise<Whoami> {
    try {
      return this.teamspeak.whoami();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerInfo(): Promise<ServerInfo> {
    try {
      return this.teamspeak.serverInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getInstanceInfo(): Promise<InstanceInfo> {
    try {
      return this.teamspeak.instanceInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerGroups(): Promise<TeamSpeakServerGroup[]> {
    try {
      return this.teamspeak.serverGroupList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getChannels(): Promise<TeamSpeakChannel[]> {
    try {
      return this.teamspeak.channelList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getSubChannels(
    getParentIdInput: GetParentIdInput,
  ): Promise<TeamSpeakChannel[]> {
    const { pid } = getParentIdInput;
    try {
      return this.teamspeak.channelList({ pid });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async clientList(): Promise<TeamSpeakClient[]> {
    try {
      return this.teamspeak.clientList({ clientType: 0 });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async addClientServerGroup(
    teamspeakClient: TeamSpeakClient,
    sgArray: number[],
  ): Promise<any> {
    try {
      return this.asyncForEach(sgArray, async (sg) => {
        return this.teamspeak.serverGroupAddClient(
          teamspeakClient.databaseId,
          sg,
        );
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async removeClientServerGroup(
    teamspeakClient: TeamSpeakClient,
    sgArray: number[],
  ): Promise<any> {
    try {
      return this.asyncForEach(sgArray, async (sg) => {
        return this.teamspeak.serverGroupDelClient(
          teamspeakClient.databaseId,
          sg,
        );
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async sendClientTextMessage(
    teamspeakClient: TeamSpeakClient,
    message: string,
  ): Promise<any> {
    try {
      this.teamspeak.sendTextMessage(teamspeakClient.clid, 1, message);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
