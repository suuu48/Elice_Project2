import express from 'express';
import { env } from './config/envconfig';
import { db } from './config/dbconfig';
import { v1Router } from './routes';

const port = Number(env.PORT);
const app = express();

db.getConnection()
  .then(async () => {
    console.log('✅ mysql2 로 DB 접속!');

    app.listen(port, () => {
      console.log('DB_HOST:', env.DB_HOST);
      console.log('DB_NAME:', env.DB_DBNAME);
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.log('error!!!!!!!', err));

app.use(express.json());

app.use('/api/v1', v1Router);
