import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes'

dotenv.config();
mongoose.connect(process.env.DB_URI!, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
  const app = express();

  app.use(process.env.BASE_URL!, router);
  
  app.use('/', (request, response) => {
    response.json('Hello There! I manage Head 2 Head Chess Stuff!');
  });
  
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  })