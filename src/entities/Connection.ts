import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user1' })
  user1!: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user2' })
  user2!: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate!: Date;
}
