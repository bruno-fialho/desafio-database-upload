import Transaction from '../models/Transaction';

export default class TransactionMap {
  public static toDTO(
    transaction: Transaction,
  ): Omit<Transaction, 'category_id'> {
    return {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      category: transaction.category,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    };
  }
}
