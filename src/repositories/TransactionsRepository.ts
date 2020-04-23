import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // Use reduce() to get the balance
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        // If 'income' or 'outcome'
        if (transaction.type === 'income') {
          accumulator.income += transaction.value;
        } else if (transaction.type === 'outcome') {
          accumulator.outcome += transaction.value;
        }

        // // Refresh total
        // accumulator.total = accumulator.income - accumulator.outcome;

        // Return the accumulator: Transaction
        return accumulator;
      },
      // Initial condition
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
    // // Return totalBalance
    // return totalBalance;
  }
}

export default TransactionsRepository;
