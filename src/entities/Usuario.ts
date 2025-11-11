import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Atividade } from './Atividade';
import { Incentivo } from './Incentivo';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column({ type: 'timestamp' })
  dataCadastro!: Date;

  @Column()
  bio!: string;

  @Column()
  metasDesenvolvimento!: string;

  @OneToMany(() => Atividade, (atividade) => atividade.autor, {
    cascade: true,
    nullable: true,
  })
  atividades?: Atividade[];

  @OneToMany(() => Incentivo, (incentivo) => incentivo.autor, {
    cascade: true,
    nullable: true,
  })
  incentivos?: Incentivo[];
}
