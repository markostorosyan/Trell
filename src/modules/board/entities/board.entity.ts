import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardMemberEntity } from '../../board-member/entities/board-member.entity';
import { ListEntity } from '../../list/entities/list.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.ownedBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: UserEntity;

  @OneToMany(() => BoardMemberEntity, (boardMember) => boardMember.board, {
    cascade: true,
  })
  members: BoardMemberEntity[];

  @OneToMany(() => ListEntity, (list) => list.board, { cascade: true })
  lists: ListEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
