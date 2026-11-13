import analyticsRoutes from './routes/analyticsRoutes.js';


import transferRoutes from './routes/transferRoutes.js';


import riskRoutes from './routes/riskRoutes.js';


import assistantRoutes from './routes/assistantRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import { KnowledgeRecord } from './models/KnowledgeRecord.js';
import userRoutes from './routes/userRoutes.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js'; // Import Project so Sequelize creates the table

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/analytics', analyticsRoutes);




// Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KnowGuard AI API is running!' });
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect DB
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
    
    // Sync database (This will create the Projects table)
    //await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
}

startServer();