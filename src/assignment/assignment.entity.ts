import { Codec } from 'ts3-nodejs-library';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Assignment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  parent: number;

  @Column({ default: 'Channel' })
  prefix: string;

  @Column({ default: 1 })
  min: number;

  @Column({ default: 0 })
  max: number;

  @Column({ default: Codec.OPUS_VOICE, enum: Codec })
  codec: Codec;

  @Column({ default: 5 })
  quality: number;

  @Column({ default: 0 })
  joinPower: number;

  @Column({ default: '' })
  topic: string;

  @Column({ default: '' })
  description: string;

  @CreateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;
}
