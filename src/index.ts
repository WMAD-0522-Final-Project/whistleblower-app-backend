import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db';

dotenv.config();
db();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});
