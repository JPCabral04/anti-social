import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from './Activity';
import { Incentive } from './Incentive';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'timestamp' })
  registrationDate!: Date;

  @Column()
  bio!: string;

  @Column()
  developmentGoals!: string;

  @OneToMany(() => Activity, (activity) => activity.author, {
    cascade: true,
    nullable: true,
  })
  activities?: Activity[];

  @OneToMany(() => Incentive, (incentive) => incentive.author, {
    cascade: true,
    nullable: true,
  })
  incentives?: Incentive[];
}
