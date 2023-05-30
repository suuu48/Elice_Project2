import express, { Request, Response } from 'express';
import { env } from './config/envconfig';

const port = Number(env.PORT);
const app = express();

interface test {
  title: string;
  content: string;
}

const test: test = {
  title: 'test',
  content: 'typescript-server',
};

app.get('/', (req: Request, res: Response) => {
  res.send(test);
});

app.listen(port, () => {
  console.log('PORT:', env.PORT);
  console.log(`Server is running on port ${port}`);
});
