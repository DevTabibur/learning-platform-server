require("dotenv").config();
function dbConnect() {
  console.log("db connected habi jabi");

  const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hc4xz.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
}

module.exports = dbConnect;
