// server.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js'; // ✅ No curly braces
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
 app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  ); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
connectDB();

// ✅ Routes
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('API is running');
});

// ✅ Start Server (only once)
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
