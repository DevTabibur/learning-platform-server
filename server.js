const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', async(req, res)=>{
    res.send("Hello world!")
});

// user:elearning
// pswd:EWA1CgP7wfsQYb76



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://elearning:EWA1CgP7wfsQYb76@cluster0.hc4xz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        await client.connect();
        const parentsCollection = client.db("elearning").collection("parents");
        const studentsCollection = client.db("elearning").collection("students");
        const teachersCollection = client.db("elearning").collection("teachers");
        const classesCollection = client.db("elearning").collection("classes");
        const subjectsCollection = client.db("elearning").collection("subjects");
        const examsCollection = client.db("elearning").collection("exams");
        const resultsCollection = client.db("elearning").collection("results");
        const paymentsCollection = client.db("elearning").collection("payments");
        const paymentsHistoryCollection = client.db("elearning").collection("paymentsHistory");
        

        app.get("/parents", async(req, res)=>{
            const parents = await parentsCollection.find({}).toArray();
            res.send(parents);
        })
    }
    finally{
        //await client.close();
    }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})