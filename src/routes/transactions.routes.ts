import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    select: ['id', 'title', 'value', 'type'],
    relations: ['category'],
  });

  // Delete category.created_at e category.updated_at

  const balance = await transactionsRepository.getBalance();

  const result = {
    transactions,
    balance,
  };

  return response.json(result);
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const { id } = request.params;

  const deleteTransactionRepository = new DeleteTransactionService();

  await deleteTransactionRepository.execute({ id });

  return response.status(204).json({});
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
