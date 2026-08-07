require('dotenv').config();
const app=require('./app');
const logger=require('./config/logger');
const connectDB=require('./config/db');

const PORT=process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    logger.info('Database connection established');

    const server=app.listen(PORT,()=> {
      logger.info(`Server running on port ${PORT}`);
    });

    
    server.on('error',(err)=> {
      logger.error({ err }, 'Server failed to start');
      process.exit(1);
    });
  } catch(err){
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();

process.on('unhandledRejection',(err)=> {
  logger.error({ err }, 'Unhandled promise rejection, shutting down');
  process.exit(1);
});