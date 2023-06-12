import express from 'express';
import { env } from './config/envconfig';
import { db } from './config/dbconfig';
import { v1Router } from './routes';
import cors from 'cors';
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

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // 접근 권한을 부여하는 도메인 ( 5500번 포트 사용 x)
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  })
);

app.use('/api/v1', v1Router);
