import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    // Ler o arquivo
    const contactsReadStream = fs.createReadStream(filePath);

    // Instanciar o csv-parse para ler a partir da linha 2
    const parsers = csvParse({
      from_line: 2,
    });

    // Usar pipe para ler uma linha por vez?
    const parseCSV = contactsReadStream.pipe(parsers);

    // Criar arrays vazios para salvar as novas transactions e categories
    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    // Criar um evento 'data'
    parseCSV.on('data', async line => {
      // Desestruturar cada linha
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      // Verificar se existem cada uma das variáveis obrigatórias
      if (!title || !type || !value) return;

      // Salvar as variáveis
      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    // Criar uma promise para mandar um resolve assim que o parseCSV terminar
    await new Promise(resolve => parseCSV.on('end', resolve));

    // Buscar categorias existentes
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    // Buscar somente titles de categorias existentes
    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    // Buscar categorias que não estão no banco de dados
    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      // Filtrar as categorias duplicadas
      .filter((value, index, self) => self.indexOf(value) === index);

    // Adicionar novas categorias ao banco de dados
    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    // Recuperar todas as categorias
    const finalCategories = [...newCategories, ...existentCategories];

    // Criar novas transactions
    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    // Salvar novas transactions no banco de dados
    await transactionsRepository.save(createdTransactions);

    // Apagar arquivo do tmp
    await fs.promises.unlink(filePath);

    // Retornar novas transactions
    return createdTransactions;
  }
}

export default ImportTransactionsService;
