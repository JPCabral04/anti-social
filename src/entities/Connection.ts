import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user1!: string;

  @Column()
  user2!: string;

  @Column({ type: 'timestamp' })
  creationDate!: Date;
}
