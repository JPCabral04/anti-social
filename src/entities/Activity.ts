import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Incentive } from './Incentive';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  editDate!: Date;

  @ManyToOne(() => User, (user) => user.activities, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'authorId' })
  author!: User;

  @Column()
  authorId!: string;

  @OneToMany(() => Incentive, (incentive) => incentive.activity, {
    cascade: true,
  })
  incentives?: Incentive[];
}
