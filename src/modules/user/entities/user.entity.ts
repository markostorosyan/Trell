import { Exclude } from 'class-transformer';
import { BoardMemberEntity } from '../../board-member/entities/board-member.entity';
import { BoardEntity } from '../../board/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTokenEntity } from './user-token.entity';
import { ListEntity } from '../../list/entities/list.entity';
import { CardEntity } from '../../card/entities/card.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @OneToMany(() => BoardEntity, (board) => board.owner)
  ownedBoards: BoardEntity[];

  @OneToMany(() => BoardMemberEntity, (boardMember) => boardMember.user)
  memberships: BoardMemberEntity[];

  @OneToMany(() => ListEntity, (list) => list.createdBy)
  createdLists: ListEntity[];

  @OneToMany(() => ListEntity, (list) => list.updatedBy)
  updatedLists: ListEntity[];

  @OneToMany(() => CardEntity, (card) => card.createdBy)
  createdCards: CardEntity[];

  @OneToMany(() => CardEntity, (card) => card.updatedBy)
  updatedCards: CardEntity[];

  @OneToMany(() => UserTokenEntity, (token) => token.user)
  tokens: UserTokenEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
