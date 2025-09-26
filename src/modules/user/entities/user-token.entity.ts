import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user-tokens')
export class UserTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  hashedRefreshToken: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
