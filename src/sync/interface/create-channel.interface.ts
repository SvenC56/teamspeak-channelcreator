import { Codec } from 'ts3-nodejs-library';

export interface CreateChannel {
  channelName: string;
  id: number;
  parent: number;
  prefix: string;
  min: number;
  max: number;
  codec: Codec;
  quality: number;
  joinPower: number;
  topic: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
