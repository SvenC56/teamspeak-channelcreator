import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
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
import { TeamspeakService } from './teamspeak.service';

@Controller('teamspeak')
export class TeamspeakController {
  constructor(private readonly teamspeakService: TeamspeakService) {}

  @Get('whoami')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Who Am I?' })
  whoami(): Promise<Whoami> {
    return this.teamspeakService.getWhoami();
  }

  @Get('serverinfo')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Server Info' })
  serverInfo(): Promise<ServerInfo> {
    return this.teamspeakService.getServerInfo();
  }

  @Get('instanceinfo')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Instance Info' })
  instanceInfo(): Promise<InstanceInfo> {
    return this.teamspeakService.getInstanceInfo();
  }

  @Get('clientlist')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Client List' })
  clientList(): Promise<TeamSpeakClient[]> {
    return this.teamspeakService.clientList();
  }

  @Get('servergrouplist')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Server Group List' })
  serverGroupList(): Promise<TeamSpeakServerGroup[]> {
    return this.teamspeakService.getServerGroups();
  }

  @Get('channellist')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Channel List' })
  channelList(): Promise<TeamSpeakChannel[]> {
    return this.teamspeakService.getChannels();
  }

  @Get('clientlist/:pid')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Get Channel List by Parent ID' })
  subChannelList(
    @Param() getParentIdInput: GetParentIdInput,
  ): Promise<TeamSpeakChannel[]> {
    return this.teamspeakService.getSubChannels(getParentIdInput);
  }
}
