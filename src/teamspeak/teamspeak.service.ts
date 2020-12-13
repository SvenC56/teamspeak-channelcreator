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
export class TeamspeakService extends TeamSpeak {
  private readonly logger = new Logger(TeamspeakService.name);

  constructor(
    private readonly teamspeakConfig: TeamspeakConfigService,
    @Inject(forwardRef(() => SyncService))
    private readonly syncService: SyncService,
  ) {
    super(teamspeakConfig.config);

    this.on('close', async () => {
      await this.reconnect(-1, 1000);
    });

    this.on('error', (e) => {
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

    this.on('ready', async () => {
      this.logger.log('Connected to TeamSpeak Server!');
      await this.useByPort(
        teamspeakConfig.serverPort,
        teamspeakConfig.nickname,
      );

      await Promise.all([
        this.registerEvent('server'),
        this.registerEvent('channel', '0'),
      ]);

      this.on('clientmoved', async () => {
        await this.syncService.compareAllChannels();
      });

      this.on('clientconnect', async () => {
        await this.syncService.compareAllChannels();
      });

      this.on('clientdisconnect', async () => {
        await this.syncService.compareAllChannels();
      });
    });
  }

  async getWhoami(): Promise<Whoami> {
    try {
      return this.whoami();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerInfo(): Promise<ServerInfo> {
    try {
      return this.serverInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getInstanceInfo(): Promise<InstanceInfo> {
    try {
      return this.instanceInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getChannels(): Promise<TeamSpeakChannel[]> {
    try {
      return this.channelList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getChannelById(
    cid: TeamSpeakChannel.ChannelType,
  ): Promise<TeamSpeakChannel> {
    try {
      return this.getChannelById(cid);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getSubChannels(pid: string): Promise<TeamSpeakChannel[]> {
    try {
      return this.channelList({ pid });
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
      const channel = await this.channelCreate(name, properties);
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
      return this.channelDelete(cid, force);
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}
