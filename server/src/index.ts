import { MongoClient } from "mongodb";
const uri = "mongodb+srv://dbZori:790303@head2headchess.p1n2r.mongodb.net/Head2HeadChess?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});