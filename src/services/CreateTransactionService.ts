import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Type not is income or outcome');
    }

    const { total } = await transactionsRepository.getBalance();

    if (
      (type === 'outcome' && total === 0 && value > 0) ||
      (type === 'outcome' && value > total)
    ) {
      throw new AppError('Outcome is less than value total');
    }

    let categoryFound = await categoriesRepository.getFindByCategory(category);

    if (!categoryFound) {
      categoryFound = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryFound);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryFound,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
