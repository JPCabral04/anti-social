import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Activity } from './Activity';

export enum IncentiveType {
  GEM = 'GEM',
  SMILE = 'SMILE',
  HEART = 'HEART',
  APPLAUSE = 'APPLAUSE',
  STAR = 'STAR',
  MEDAL = 'MEDAL',
}

@Entity()
export class Incentive {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: IncentiveType,
  })
  type!: IncentiveType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate!: Date;

  @ManyToOne(() => User, (user) => user.incentives, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @Column()
  authorId!: string;

  @ManyToOne(() => Activity, (activity) => activity.incentives, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'activityId' })
  activity!: Activity;

  @Column()
  activityId!: string;
}
