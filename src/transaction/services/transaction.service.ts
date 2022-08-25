import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transaction.entity';

@Injectable()
export class TransactionSevice extends TypeOrmCrudService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {
    super(transactionRepository);
  }
  async findAll(): Promise<Transaction[]> {
    return this.repo.find();
  }
}
