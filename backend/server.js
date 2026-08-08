import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import path from 'path'
import { fileURLToPath } from 'url';
import 'dotenv/config'

import bookRouter from './routes/bookRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import teamRouter from './routes/teamRoute.js';
import authorRouter from './routes/authorRoute.js';
import adminRouter from './routes/adminRoute.js';




const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://book-store-mern-cyan.vercel.app/',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// // MIDDLEWARE
// app.use(cors({
//     origin: true,
//     credentials: true,
// }));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));




// DB

connectDB();

// ROUTES

app.use('/api/user', userRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/book', bookRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/team', teamRouter);
app.use('/api/author', authorRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
})

export default app;