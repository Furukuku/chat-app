import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import './db';
import router from './routes';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
  methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE'],
  origin: 'http://localhost:3000',
  allowedHeaders: [
    'Content-type',
    'Authorization',
  ]
}));

app.use('/', router);

app.listen(port, () => console.log('Running on port:', port));