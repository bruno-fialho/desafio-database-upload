<p align="right">
  <a href="README.en.md">🇺🇸</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="README.md">🇧🇷</a>&nbsp;&nbsp;&nbsp;
</p>

<img alt="GoStack" src=./src/assets/header-bootcamp.png />

<h3 align="center">
  Challenge 06: Database and file upload in Node.js
</h3>

<p align="center">
  <a href="#rocket-about-the-application">About the application</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#cd-installed-packages">Installed packages</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licence">Licence</a>
</p>

<img alt="Insomnia" src=./src/assets/screen-insomnia.gif />

## :rocket: About the application

An application in Node.js along with TypeScript, using a database with TypeORM and sending files with Multer!

This is an application for storing incoming and outgoing financial transactions and allowing the registration and listing of these transactions, in addition to allowing the creation of new records in the database by sending a csv file.

### Application Template

The template is available in the following URL: **[Access Template](https://github.com/Rocketseat/gostack-template-typeorm-upload)**

**Tip**: In case you don't know how to use Github repositories as templates, we have a guide in **[Rocketseat FAQ](https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/faq-desafios).**

Navigate to the created folder and open it in the Visual Studio Code, remember to execute the command `yarn` in your terminal in order to install all the dependencies

### Application Routes

The application has the following routes:

- **`POST /transactions`**: The route must receive `title`, `value`, `type`, and `category` within the request body, with `type` being the type of the transaction, which must be `income` for entries (deposits) and `outcome` for exits (withdrawals). When registering a new transaction, it must be stored within your database, with the fields `id`, `title`, `value`, `type`, `category_id`, `created_at`, `updated_at`.

```json
{
  "id": "uuid",
  "title": "Salário",
  "value": 3000,
  "type": "income",
  "category": "Alimentação"
}
```

- **`GET /transactions`**: This route should return a listing with all the transactions you have registered so far, together with the sum of the entries, withdrawals and total credit. This route must return an object in the following format:

```json
{
  "transactions": [
    {
      "id": "uuid",
      "title": "Salário",
      "value": 4000,
      "type": "income",
      "category": {
        "id": "uuid",
        "title": "Salary",
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      "created_at": "2020-04-20T00:00:49.620Z",
      "updated_at": "2020-04-20T00:00:49.620Z"
    },
    {
      "id": "uuid",
      "title": "Freela",
      "value": 2000,
      "type": "income",
      "category": {
        "id": "uuid",
        "title": "Others",
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      "created_at": "2020-04-20T00:00:49.620Z",
      "updated_at": "2020-04-20T00:00:49.620Z"
    },
    {
      "id": "uuid",
      "title": "Pagamento da fatura",
      "value": 4000,
      "type": "outcome",
      "category": {
        "id": "uuid",
        "title": "Others",
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      "created_at": "2020-04-20T00:00:49.620Z",
      "updated_at": "2020-04-20T00:00:49.620Z"
    },
    {
      "id": "uuid",
      "title": "Cadeira Gamer",
      "value": 1200,
      "type": "outcome",
      "category": {
        "id": "uuid",
        "title": "Recreation",
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },
      "created_at": "2020-04-20T00:00:49.620Z",
      "updated_at": "2020-04-20T00:00:49.620Z"
    }
  ],
  "balance": {
    "income": 6000,
    "outcome": 5200,
    "total": 800
  }
}
```

- **`DELETE /transactions/:id`**: The route must delete a transaction with the `id` present in the route parameters;

- **`POST /transactions/import`**: The route must allow the import of a file in` .csv` format containing the same information needed to create a transaction `id`, `title`, `value`, `type`,` category_id`, `created_at`, `updated_at`, where each line of the CSV file must be a new record for the database, and finally return all the `transactions` that have been imported into your database. The csv file, must follow the following [model](https://github.com/rocketseat-education/bootcamp-gostack-desafios/blob/master/desafio-database-upload/assets/file.csv).

### Specification of tests

In each test, you have a brief description of what your application must do in order for the test suits pass.

If you have questions about what the tests are, and how to interpret them, take a look at **[Rocketseat FAQ](https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/faq-challenges).**

For this challenge we have the following tests:

<h4 align="center">
  ⚠️ Before running the tests, create a database with the name "gostack_desafio06_tests" so that all tests can run correctly ⚠️
</h4>

- **`should be able to create a new transaction`**: For this test to pass, your application must allow a transaction to be created, and return a json with the created transaction.

- **`should create tags when inserting new transactions `**: For this test to pass, your application must allow that when creating a new transaction with a category that does not exist, it is created and inserted in the category_id field of the transaction with the `id` that has just been created.

- **`should not create tags when they already exists`**: For this test to pass, your application must allow when creating a new transaction with a category that already exists, to be assigned to the category_id field of the transaction with `id` of that existing category, not allowing the creation of categories with the same `title`.

- **`should be able to list the transactions`**: In order for this test to pass, your application must allow an array of objects to be returned containing all transactions along with the balance of income, outcome and total transactions that were created until now.

- **`should not be able to create outcome transaction without a valid balance`**: In order for this test to pass, your application must not allow an `outcome` transaction to exceed the total amount the user has in cash (total income), returning a response with HTTP 400 code and an error message in the following format: `error: string}`.

- **`should be able to delete a transaction`**: In order for this test to pass, you must allow your delete route to delete a transaction, and when doing the deletion, it returns an empty response, with status 204.

- **`should be able to import transactions`**: For this test to pass, your application must allow a csv file to be imported, containing the following [model](https://github.com/rocketseat-education/bootcamp-gostack-desafios/blob/master/desafio-database-upload/assets/file.csv). With the imported file, you must allow all records and categories that were present in that file to be created in the database, and return all transactions that were imported.

## :cd: Installed packages

The following is a list of installed packages:

- [express](https://www.npmjs.com/package/express)
- [express-async-errors](https://github.com/davidbanham/express-async-errors#readme)
- [typescript](https://www.typescriptlang.org/)
- [ts-node](https://github.com/TypeStrong/ts-node)
- [ts-node-dev](https://github.com/whitecolor/ts-node-dev#readme)
- [jest](https://jestjs.io/docs/en/getting-started)
- [ts-jest](https://kulshekhar.github.io/ts-jest)
- [supertest](https://www.npmjs.com/package/supertest)
- [uuidv4](https://github.com/thenativeweb/uuidv4#readme)
- [multer](https://github.com/expressjs/multer#readme)
- [typeorm](https://github.com/typeorm/typeorm#readme)
- [pg](https://github.com/brianc/node-postgres)
- [reflect-metadata](http://rbuckton.github.io/reflect-metadata)
- [cross-env](https://github.com/kentcdodds/cross-env#readme)
- [dotenv](https://github.com/motdotla/dotenv#readme)
- [csv-parse](https://csv.js.org/parse/)
- [cors](https://github.com/expressjs/cors#readme)


	Optional
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [eslint-import-resolver-typescript](https://github.com/alexgorbatchev/eslint-import-resolver-typescript#readme)

## :memo: Licence

This project is under license from MIT. See the archive [LICENSE](LICENSE) to more details.
