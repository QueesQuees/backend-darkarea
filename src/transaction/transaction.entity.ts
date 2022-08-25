import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  senderId: string;

  @Column({ unique: true })
  receiverId: string;

  @Column({ default: 0 })
  amount: number;
}
