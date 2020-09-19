import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  @ApiTags('sync')
  @ApiOperation({ summary: 'Compare all channels in TeamSpeak' })
  groups(): Promise<any> {
    return this.syncService.compareAllChannels();
  }
}
