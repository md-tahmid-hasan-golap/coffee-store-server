const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

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

    // coffe collaction
    const coffeesCollaction = client.db("coffee-store").collection("coffees")



      // all coffees get mathord
      app.get('/coffees', async(req, res) => {
        const result = await coffeesCollaction.find().toArray()
        res.send(result)
      })


      // coffees limit(6)
      app.get('/coffees-limit', async(req, res) => {
        const result = await coffeesCollaction.find().limit(6).toArray()
        res.send(result)
      })
     
      // coffee details mathored
       app.get('/coffees-details/:id', async(req, res) => {
        const id = req.params.id
        const queary = {_id: new ObjectId(id)}
        const result = await coffeesCollaction.findOne(queary)
        res.send(result)
      })

      // coffees delete mathored
      app.delete('/coffees-delete/:id', async(req, res) => {
        const id = req.params.id
        const queary = {_id: new ObjectId(id)}
        const result = await coffeesCollaction.deleteOne(queary)
        res.send(result)     
      })

      // coffee update 
      app.put('/coffee-updded/:id', async(req, res) => {
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updateCoffee = req.body
        const updateDoc = {
            $set: updateCoffee
        }
        const result = await coffeesCollaction.updateOne(filter,updateDoc,options)
         res.send(result)
      })


      //My added Coffee 
      app.get('/myAddedCoffee/:email', async(req, res) =>{
        const email = req.params.email
        const queary = {email}
        const result = await coffeesCollaction.find(queary).toArray()
        res.send(result)
      })
    // coffees post mathord
    app.post('/coffees', async(req, res) => {
        const newCoffee = req.body
        const result = await coffeesCollaction.insertOne(newCoffee)
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
  res.send('Welcome to Coffee Store API!')
})

app.listen(port, () => {
  console.log(`Coffee Store server listening on port ${port}`)
})