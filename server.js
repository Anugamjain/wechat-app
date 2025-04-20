import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth_routes.js';
import connectDB from './config/db.js';
import cors from 'cors';
// import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['GET', 'POST'],
   credentials: true
 }));

app.use(authRouter);


connectDB();

// console.log(crypto.randomBytes(64).toString('hex'));

app.get('/', (req, res) => {
   res.send("Hello from express js");
});

app.listen(process.env.PORT, () => console.log("Listening on PORT: ", process.env.PORT));