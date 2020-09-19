import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Assignment } from 'src/assignment/assignment.entity';
import { AssignmentService } from 'src/assignment/assignment.service';
import { TeamspeakService } from 'src/teamspeak/teamspeak.service';
import { TeamSpeakChannel } from 'ts3-nodejs-library';
import { ChannelEdit } from 'ts3-nodejs-library/lib/types/PropertyTypes';
import { Permission } from 'ts3-nodejs-library/lib/util/Permission';
import { CreateChannel } from './interface/create-channel.interface';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    @Inject(forwardRef(() => TeamspeakService))
    private readonly teamspeakService: TeamspeakService,
    private readonly assignmentService: AssignmentService,
  ) {}

  /**
   * Synchronisation every 5 minutes
   *
   * @return {*}  {Promise<any>}
   * @memberof SyncService
   */
  @Cron('*/5 * * * *')
  private async handleCron(): Promise<any> {
    return this.compareAllChannels();
  }

  async compareAllChannels(): Promise<any> {
    const assignments = await this.assignmentService.getAssignments();

    const { toCreate, toDelete } = await this.checkAllChannels(assignments);

    return this.handleResult(toCreate, toDelete);
  }

  private async checkAllChannels(syncChannels: Assignment[]) {
    let filteredChannels: TeamSpeakChannel[] = [];
    const toCreate: CreateChannel[] = [];
    let toDelete: TeamSpeakChannel[] = [];

    for (const element of syncChannels) {
      try {
        //   Convert Number to string
        const pid = '' + element.parent;

        filteredChannels = await this.teamspeakService.getSubChannels(pid);
      } catch (error) {
        this.logger.error(error.message);
      }

      let i = 0;
      for (const channel of filteredChannels) {
        if (channel.totalClients > 0) {
          i++;
        }
      }
      // Sort channels in correct order
      // sortChannels(filteredChannels)
      if (i === filteredChannels.length - 1) {
        // keep these channels
      } else if (i === filteredChannels.length) {
        // create new channels
        if (filteredChannels[filteredChannels.length - 1]) {
          const highestChannelNumber = this.getChannelNumber(filteredChannels);
          toCreate.push({
            ...element,
            channelName: `${element.prefix} ${highestChannelNumber + 1}`,
          });
        } else {
          toCreate.push({ ...element, channelName: `${element.prefix} 1` });
        }
      } else {
        const markDelete = filteredChannels.filter((x) => x.totalClients === 0);
        // Remove first element
        markDelete.shift();
        toDelete = [...toDelete, ...markDelete];
      }
    }
    return { toCreate, toDelete };
  }

  private async handleResult(
    toCreate: CreateChannel[],
    toDelete: TeamSpeakChannel[],
  ): Promise<void> {
    if (toCreate.length > 0) {
      toCreate.forEach(async (channel) => {
        try {
          const channelName = channel.channelName;
          const properties: ChannelEdit = {
            cpid: '' + channel.parent,
            channelCodec: channel.codec,
            channelCodecQuality: channel.quality,
            channelFlagPermanent: true,
            channelTopic: channel.topic,
            channelDescription: channel.description,
          };
          const perms: Permission.PermType[] = [
            {
              permname: 'i_channel_needed_join_power',
              permvalue: channel.joinPower,
            },
            { permname: 'i_channel_needed_modify_power', permvalue: 75 },
          ];
          await this.teamspeakService.createChannel(
            channelName,
            properties,
            perms,
          );
          this.logger.log(
            `Create channel '${channel.channelName}' with Parent ID: ${channel.parent}`,
          );
        } catch (error) {
          this.logger.error(error.message);
        }
      });
    }

    if (toDelete.length > 0) {
      toDelete.forEach(async (channel) => {
        try {
          await this.teamspeakService.deleteChannel(channel.cid, false);
          this.logger.log(
            `Delete channel '${channel.name}' with Parent ID: ${channel.pid}`,
          );
        } catch (error) {
          this.logger.error(error.message);
        }
      });
    }
  }

  //   private sortChannels(channels: TeamSpeakChannel[]) {
  //     return channels.sort((a, b) => {
  //       // Strip chars from string
  //       const keyA = a.name.match(/\d+$/);
  //       const keyB = b.name.match(/\d+$/);
  //       return parseInt(keyA[0]) - parseInt(keyB[0]);
  //     });
  //   }

  private getChannelNumber(channels: TeamSpeakChannel[]) {
    const numbers = channels.map((channel) =>
      parseInt(channel.name.match(/\d+$/)[0]),
    );
    return Math.max(...numbers);
  }
}
