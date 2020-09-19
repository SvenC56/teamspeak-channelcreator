import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { TeamspeakConfigService } from 'src/config/teamspeak/config.service';
import { SyncService } from 'src/sync/sync.service';
// TeamSpeak
import { TeamSpeak, TeamSpeakChannel } from 'ts3-nodejs-library';
import { ChannelEdit } from 'ts3-nodejs-library/lib/types/PropertyTypes';
import {
  InstanceInfo,
  ServerInfo,
  Whoami,
} from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { Permission } from 'ts3-nodejs-library/lib/util/Permission';

@Injectable()
export class TeamspeakService {
  private readonly logger = new Logger(TeamspeakService.name);

  private teamspeak: TeamSpeak;
  constructor(
    private readonly teamspeakConfig: TeamspeakConfigService,
    @Inject(forwardRef(() => SyncService))
    private readonly syncService: SyncService,
  ) {
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

    this.teamspeak.on('ready', async () => {
      this.logger.log('Connected to TeamSpeak Server!');
      await this.teamspeak.useByPort(
        teamspeakConfig.serverPort,
        teamspeakConfig.nickname,
      );

      await Promise.all([
        this.teamspeak.registerEvent('server'),
        this.teamspeak.registerEvent('channel', '0'),
      ]);

      this.teamspeak.on('clientmoved', async () => {
        await this.syncService.compareAllChannels();
      });

      this.teamspeak.on('clientconnect', async () => {
        await this.syncService.compareAllChannels();
      });

      this.teamspeak.on('clientdisconnect', async () => {
        await this.syncService.compareAllChannels();
      });
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

  async getChannels(): Promise<TeamSpeakChannel[]> {
    try {
      return this.teamspeak.channelList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getChannelById(
    cid: TeamSpeakChannel.ChannelType,
  ): Promise<TeamSpeakChannel> {
    try {
      return this.teamspeak.getChannelById(cid);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getSubChannels(pid: string): Promise<TeamSpeakChannel[]> {
    try {
      return this.teamspeak.channelList({ pid });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async createChannel(
    name: string,
    properties?: ChannelEdit,
    perms?: Permission.PermType[],
  ): Promise<TeamSpeakChannel> {
    try {
      const channel = await this.teamspeak.channelCreate(name, properties);
      for (const perm of perms) {
        // TODO Set Permissions
        await channel.setPerm(perm);
      }
      return channel;
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async deleteChannel(
    cid: TeamSpeakChannel.ChannelType,
    force?: boolean,
  ): Promise<[]> {
    try {
      return this.teamspeak.channelDelete(cid, force);
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
