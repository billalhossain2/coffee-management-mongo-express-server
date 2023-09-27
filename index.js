const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 9000;

//Routes
app.get("/", (req, res) => {
  res.send(`Coffee management server is running on port ${port}`);
});


const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeDB = client.db("coffeeDB");
    const coffeeCollection = coffeeDB.collection("coffeeCollection");

    //create a new coffe to DB
    app.post("/coffee", async(req, res)=>{
        const coffee = req.body;
        const result = await coffeeCollection.insertOne(coffee)
        res.send(result)
    })
   
    //retrieve all coffees from DB
    app.get("/coffees", async(req, res)=>{
        const result = await coffeeCollection.find({}).toArray();
        res.send(result)
    })

    //retrieve a single coffee
    app.get("/coffee/:coffeeId", async(req, res)=>{
        const coffeeId = req.params.coffeeId;
        const query = {_id: new ObjectId(coffeeId)}
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })

    //delete a coffee from DB
    app.delete("/coffee/:coffeeId", async(req, res)=>{
        const coffeeId = req.params.coffeeId;
        const query = {_id:new ObjectId(coffeeId)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })

    //delete all coffees from DB
    app.delete("/coffees", async(req, res)=>{
        const result = await coffeeCollection.deleteMany({});
        res.send(result)
    })

    //update a single document in DB
    app.put("/coffee/:coffeeId", async(req, res)=>{
        const coffeeId = req.params.coffeeId;
        const updateCoffee = req.body;
        const updateDoc = {
            $set:updateCoffee
        }

        const filter = {_id:new ObjectId(coffeeId)};
        const options = { upsert: true };

        const result = await coffeeCollection.updateOne(filter, updateDoc, options)
        res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Coffee management server is listening on port ${port}`);
});
