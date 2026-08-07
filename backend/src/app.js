const express=require('express');
const cors=require('cors');
require('dotenv').config();

const requestLogger=require('./middleware/requestLogger');
const { errorHandler }=require('./middleware/errorHandler');
const AppError=require('./utils/appError');

const authRoutes=require('./routes/auth.routes');
const notesRoutes=require('./routes/notes.routes');

const app=express();

app.use(cors());
app.use(express.json({ limit:'1mb'}));
app.use(requestLogger);

app.get('/api/health',(req, res)=> {
  res.status(200).json({ success: true, message: 'API is up' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(errorHandler);

module.exports=app;
