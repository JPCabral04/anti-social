import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './Usuario';
import { Atividade } from './Atividade';

export enum TipoIncentivo {
  JOIA = 'JOIA',
  SORRISO = 'SORRISO',
  CORACAO = 'CORACAO',
  APLAUSO = 'APLAUSO',
  ESTRELA = 'ESTRELA',
  MEDALHA = 'MEDALHA',
}

@Entity()
export class Incentivo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TipoIncentivo,
  })
  tipo!: TipoIncentivo;

  @Column({ type: 'timestamp' })
  dataCriacao!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.incentivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'autorId' })
  autor!: Usuario;

  @Column()
  autorId!: string;

  @ManyToOne(() => Atividade, (atividade) => atividade.incentivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'atividadeId' })
  atividade!: Atividade;

  @Column()
  atividadeId!: string;
}
