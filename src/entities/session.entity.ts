import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  Column,
} from 'typeorm';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({
    name: 'user_id',
  })
  userId: string;

  @Column({
    nullable: true,
  })
  agent?: string;

  @Column({
    nullable: true,
  })
  ip?: string;

  @Column()
  token: string;

  @Column({
    name: 'refresh_token',
  })
  refreshToken: string;

  @CreateDateColumn({ name: 'create_at' })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt?: Date;
}
