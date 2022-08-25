import { Controller, Get } from '@nestjs/common';
import { TransactionSevice } from './services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionSevice) {}

  @Get()
  async getTransaction() {
    return this.transactionService.findAll();
  }
}
