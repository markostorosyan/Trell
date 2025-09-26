import { UserEntity } from '../../user/entities/user.entity';
import { BoardEntity } from '../../board/entities/board.entity';
import { CardEntity } from '../../card/entities/card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lists')
export class ListEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @ManyToOne(() => BoardEntity, (board) => board.lists, { onDelete: 'CASCADE' })
  board: BoardEntity;

  @OneToMany(() => CardEntity, (card) => card.list, { cascade: true })
  cards: CardEntity[];

  @ManyToOne(() => UserEntity, (user) => user.createdLists, {
    onDelete: 'SET NULL',
  })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.updatedLists, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  updatedBy?: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
