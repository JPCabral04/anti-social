import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Conexao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  usuario1!: string;

  @Column()
  usuario2!: string;

  @Column({ type: 'timestamp' })
  dataCriacao!: Date;
}
