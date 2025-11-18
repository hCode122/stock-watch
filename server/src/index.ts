import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/environment';
import { testConnection } from './config/database';
import { initDatabase } from './scripts/initDatabase';
import routes from './routes'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('combined'));


app.use('/api', routes); 

app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(config.nodeEnv === 'development' && { details: err.message })
  });
});


const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    await initDatabase();

    app.listen(config.port, () => {
      console.log('🚀 Stock Tracker API Server Started!');
      console.log(`📍 Port: ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📊 Health: http://localhost:${config.port}/health`);
      console.log(`🔧 Test: http://localhost:${config.port}/api/test`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();