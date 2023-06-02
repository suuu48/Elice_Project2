import { env } from './envconfig';
import mysql from 'mysql2/promise';

// mysql2 Connect
// mysql2를 사용하면 MySQL 데이터베이스에서 직접 쿼리를 실행
export const db = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DBNAME,
    port: 3306,
});
