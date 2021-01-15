import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(): Promise<Transaction[]> {
    const transactions: Transaction[] = [];

    return transactions;
  }
}

export default ImportTransactionsService;
