import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardEntity } from '../../board/entities/board.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { BoardMemberRole } from '../../../constants/board-member-role.enum';

@Entity('board_members')
export class BoardMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: BoardMemberRole,
    default: BoardMemberRole.MEMBER,
  })
  role: BoardMemberRole;

  @ManyToOne(() => UserEntity, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => BoardEntity, (board) => board.members, {
    onDelete: 'CASCADE',
  })
  board: BoardEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
