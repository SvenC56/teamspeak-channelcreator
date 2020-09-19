import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Assignment } from 'src/assignment/assignment.entity';
import { AssignmentService } from 'src/assignment/assignment.service';
import { TeamspeakService } from 'src/teamspeak/teamspeak.service';
import { TeamSpeakChannel } from 'ts3-nodejs-library';

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

    if (toCreate.length > 0) {
      console.log(toCreate);
    }

    if (toDelete.length > 0) {
      console.log(toDelete);
    }

    return;
  }

  private async checkAllChannels(syncChannels: Assignment[]) {
    let filteredChannels: TeamSpeakChannel[] = [];
    const toCreate: TeamSpeakChannel[] = [];
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
        let channel = null;
        if (filteredChannels[filteredChannels.length - 1]) {
          const highestChannelNumber = this.getChannelNumber(filteredChannels);
          channel = {
            channel_name: `${element.prefix} ${highestChannelNumber + 1}`,
            ...element,
          };
          toCreate.push(channel);
        } else {
          channel = {
            channel_name: `${element.prefix} 1`,
            ...element,
          };
          toCreate.push(channel);
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
