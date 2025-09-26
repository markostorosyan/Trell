import { UserEntity } from '../../user/entities/user.entity';
import { ListEntity } from '../../list/entities/list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cards')
export class CardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => ListEntity, (list) => list.cards, { onDelete: 'CASCADE' })
  list: ListEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdCards, {
    onDelete: 'SET NULL',
  })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.updatedCards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  updatedBy?: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
