import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './Usuario';
import { Incentivo } from './Incentivo';

@Entity()
export class Atividade {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  titulo!: string;

  @Column({ type: 'text' })
  descricao!: string;

  @Column({ type: 'timestamp' })
  dataCriacao!: Date;

  @Column({ type: 'timestamp' })
  dataEdicao!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.atividades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'autorId' })
  autor!: Usuario;

  @Column()
  autorId!: string;

  @OneToMany(() => Incentivo, (incentivo) => incentivo.atividade, {
    cascade: true,
    nullable: true,
  })
  incentivos?: Incentivo[];
}
