import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from './Activity';
import { Incentive } from './Incentive';
import { Comment } from './Comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  developmentGoals?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate!: Date;

  @OneToMany(() => Activity, (activity) => activity.author, {
    cascade: true,
  })
  activities?: Activity[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments?: Comment[];

  @OneToMany(() => Incentive, (incentive) => incentive.author, {
    cascade: true,
  })
  incentives?: Incentive[];
}
