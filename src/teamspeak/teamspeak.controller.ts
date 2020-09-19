import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamSpeakChannel } from 'ts3-nodejs-library';
import {
  InstanceInfo,
  ServerInfo,
  Whoami,
} from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { CreateChannelInput } from './input/create-channel.input';
import { DeleteChannelInput } from './input/delete-channel.input';
import { GetChannelByIdInput } from './input/get-channel-by-id.input';
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

  @Get('channel')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Channel List' })
  channelList(): Promise<TeamSpeakChannel[]> {
    return this.teamspeakService.getChannels();
  }

  @Get('channel/:pid')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Get Channel List by Parent ID' })
  subChannelList(
    @Param() getParentIdInput: GetParentIdInput,
  ): Promise<TeamSpeakChannel[]> {
    const { pid } = getParentIdInput;
    return this.teamspeakService.getSubChannels(pid);
  }

  @Get('channel/find/:cid')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Get Single Channel by Parent ID' })
  getSingleChannel(
    @Param() getChannelByIdInput: GetChannelByIdInput,
  ): Promise<TeamSpeakChannel> {
    return this.teamspeakService.getChannelById(getChannelByIdInput.cid);
  }

  @Post('channel')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'TeamSpeak - Create a Channel' })
  createChannel(
    @Body() createChannelInput: CreateChannelInput,
  ): Promise<TeamSpeakChannel> {
    return this.teamspeakService.createChannel(createChannelInput.name);
  }

  @Delete('channel')
  @ApiOperation({ summary: 'TeamSpeak - Delete Single Channel by ID' })
  @ApiTags('teamspeak')
  deleteChannel(@Body() deleteChannelInput: DeleteChannelInput): Promise<[]> {
    return this.teamspeakService.deleteChannel(
      deleteChannelInput.cid,
      deleteChannelInput.force,
    );
  }
}
