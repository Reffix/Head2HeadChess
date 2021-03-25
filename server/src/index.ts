import mongoose from 'mongoose';
const uri = "mongodb+srv://dbZori:790303@head2headchess.p1n2r.mongodb.net/Head2HeadChess?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

