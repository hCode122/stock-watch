import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { envConfig } from './config/environment';
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
    ...(envConfig.nodeEnv === 'development' && { details: err.message })
  });
});


const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }

    await initDatabase();

    app.listen(envConfig.port, () => {
      console.log('🚀 Stock Tracker API Server Started!');
      console.log(`📍 Port: ${envConfig.port}`);
      console.log(`🌍 Environment: ${envConfig.nodeEnv}`);
      console.log(`📊 Health: http://localhost:${envConfig.port}/health`);
      console.log(`🔧 Test: http://localhost:${envConfig.port}/api/test`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();