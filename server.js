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

// my name is topu 
// user:elearning
// pswd:EWA1CgP7wfsQYb76



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const usersCollection = client.db("elearning").collection("users");

        //load all user
        app.get("/users", async(req, res)=>{
            const result = await usersCollection.find({}).toArray();
            res.send(result)
        })


        // 1.a => load parents list
        // app.get("/parents", async(req, res)=>{
        //     const parents = await parentsCollection.find({}).toArray();
        //     res.send(parents);
        // })

        // 1.b => load one parent list by _id
        app.get("/parents/:id", async(req, res)=>{
            const id = req.params.id;
            const filter = {_id:new ObjectId(id)};
            const result = await parentsCollection.findOne(filter);
            res.send(result)
        })
        
        // 1.c => for parents pagination pages and sizes
        app.get("/parents", async(req, res)=>{
            console.log('query', req.query)
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            // console.log('page, size', page, size)
            const cursor = parentsCollection.find({});

            let parents;
            if(page || size){
                parents = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                parents = await cursor.toArray();
            }
            res.send(parents)
        })
        // 1.d => for count of parents pagination
        app.get("/parentsCount", async(req, res)=>{
            const count = await parentsCollection.estimatedDocumentCount();
            res.send({count});
        })



        // load students list
        app.get("/students", async(req, res)=>{
            const students = await studentsCollection.find({}).toArray();
            res.send(students);
        })
        // load one student list by _id
        app.get("students/:id", async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const result = await studentsCollection.findOne(filter);
            res.send(result)
        })


        // load teachers list
        app.get("/teachers", async(req, res)=>{
            const teachers = await teachersCollection.find({}).toArray();
            res.send(teachers);
        })
        // load one teacher list by _id
        app.get("/teachers/:id", async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const result = await teachersCollection.findOne(filter);
            res.send(result)
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