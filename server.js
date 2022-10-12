const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { addUser, removeUser, getUserById } = require("./Users");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());
// socket
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// socket connection
io.on("connection", (socket) => {
  // console.log("new user connected");

  socket.on("join", ({ name, room }, callback) => {
    console.log("join request", name);
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      callback(error);
    }
    socket.join(room);
    socket.emit("message", {
      user: "System",
      text: `Welcome ${name} to ${room}`,
    });
    socket.broadcast.to(room).emit("message", {
      user: "System",
      text: `${name} just joined ${room}`,
    });

    callback();
  });

  // get messages
  socket.on("message", (message) => {
    const user = getUserById(socket.id);
    io.to(user?.room).emit("message", {
      user: user?.name,
      text: message,
    });
    console.log("message : ", message);
  });

  // user disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = removeUser(socket.id);

    if(user){
      io.to(user?.room).emit("message", {
        user: "System",
        text: `${user?.name} just left ${user?.room}`,
      });
    }
    


  });
});

app.get("/", async (req, res) => {
  res.send("Hello world!");
});

// user:elearning
// pswd:EWA1CgP7wfsQYb76

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hc4xz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("elearning").collection("users");
    const parentsCollection = client.db("elearning").collection("parents");
    const studentsCollection = client.db("elearning").collection("students");
    const teachersCollection = client.db("elearning").collection("teachers");
    const bookingsCollection = client.db("elearning").collection("bookings");
    const messagesCollection = client.db("elearning").collection("message");
    const subjectsCollection = client.db("elearning").collection("subjects");
    const libraryCollection = client.db("elearning").collection("library");
    const examsCollection = client.db("elearning").collection("exams");
    const resultsCollection = client.db("elearning").collection("results");
    const paymentsCollection = client.db("elearning").collection("payments");
    const paymentsHistoryCollection = client
      .db("elearning")
      .collection("paymentsHistory");
    const tuitionServices = client
      .db("elearning")
      .collection("tuitionServices");

    // 1.a => load all user
    app.get("/user", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    // 1.b => load single user by _id
    app.get("/userWithID/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // 1.c => update every user specific by email
    //save registered user in db
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const filter = { email: email };
      const user = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      // giving every user a jwt token
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.send({ result, accessToken: token });
    });

    // 1.d => get single data filtering by email
    app.get("/userWithEmail/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await usersCollection.findOne(filter);
      res.send(result);
    });

    // 2.a => make admin API
    app.put("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: { superRole: "admin" },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ result, code: 200 });
    });

    // 2.b => check ADMIN API
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const user = await usersCollection.findOne(filter);
      const isAdmin = user.superRole === "admin";
      res.send({ admin: isAdmin });
    });

    // 2.c => remove user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    // 2.a => load parents list
    app.get("/parents", async (req, res) => {
      const parents = await parentsCollection.find({}).toArray();
      res.send(parents);
    });

    // 2.b => load one parent list by _id
    app.get("/parents/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await parentsCollection.findOne(filter);
      res.send(result);
    });

    // 2.c => for parents pagination pages and sizes
    app.get("/parents", async (req, res) => {
      // console.log('query', req.query)
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      // console.log('page, size', page, size)
      const cursor = parentsCollection.find({});

      let parents;
      if (page || size) {
        parents = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        parents = await cursor.toArray();
      }
      res.send(parents);
    });
    // 2.d => for count of parents pagination
    app.get("/parentsCount", async (req, res) => {
      const count = await parentsCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // load students list
    app.get("/students", async (req, res) => {
      const students = await studentsCollection.find({}).toArray();
      res.send(students);
    });
    // load one student list by _id
    app.get("students/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await studentsCollection.findOne(filter);
      res.send(result);
    });

    // load teachers list
    app.get("/teachers", async (req, res) => {
      const teachers = await teachersCollection.find({}).toArray();
      res.send(teachers);
    });
    // load one teacher list by _id
    app.get("/teachers/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await teachersCollection.findOne(filter);
      res.send(result);
    });

    // load tuition services
    app.get("/tuition-services", async (req, res) => {
      const result = await tuitionServices.find({}).toArray();
      res.send(result);
    });

    // load all booking info
    app.get("/booking", async (req, res) => {
      const result = await bookingsCollection.find({}).toArray();
      res.send(result);
    });

    // send booking info server to db
    app.post("/booking", async (req, res) => {
      const result = await bookingsCollection.insertOne(req.body);
      res.send({ result, code: 200 });
    });

    // get library collection
    app.get("/library", async (req, res) => {
      const result = await libraryCollection.find({}).toArray();
      res.send(result);
    });

    // load single library collection by id
    app.get("/library/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await libraryCollection.findOne(filter);
      res.send(result);
    });

    // post library books to server to db
    app.post("/library", async (req, res) => {
      const data = req.body;
      const result = await libraryCollection.insertOne(data);
      res.send(result);
    });

    // load messages collections
    app.get("/messages", async (req, res) => {
      const result = await messagesCollection.find({}).toArray();
      res.send(result);
    });

    // post messages server to db
    app.post("/messages", async (req, res) => {
      const data = req.body;
      const result = await messagesCollection.insertOne(data);
      res.send(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
