const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 3000;
const app = express()



app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8prwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

      //dataBase collaction
    const coffeeCollaction = client.db('coffee-store').collection('coffees')



    //get mathored 
    app.get('/coffees', async(req,res) => {
        const result = await coffeeCollaction.find().toArray()
        res.send(result)
    })

     


    // get view dwtails button
    app.get('/coffee/:id', async (req, res) => {
        const id = req.params.id;
        const query  = {_id: new ObjectId(id)}
        const result = await coffeeCollaction.findOne(query )
        res.send(result)
    })




    // get mathord chack email
    app.get('/my-coffees/:email', async (req, res) => {
        const email = req.params.email;
        const query  = {email}
        const result = await coffeeCollaction.find(query).toArray()
        res.send(result)
    })




    //post mathored
    app.post('/coffees', async(req,res) => {
        const newCoffee = req.body
        const result = await coffeeCollaction.insertOne(newCoffee)
        res.send(result)
    })











    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
  res.send('welcome to coffee store server!')
})

app.listen(port, () => {
  console.log(`welcome to coffee store server listening on port ${port}`)
})