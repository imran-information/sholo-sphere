const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 9000
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eedxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    const db = client.db("soloSphere")
    const jobsCollections = db.collection('jobs')

    app.post('/add-job', async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollections.insertOne(newJob);
      res.send(result)

    })

    app.get('/jobs', async (req, res) => {
      const result = await jobsCollections.find().toArray()
      res.send(result)
    })

    app.get('/jobs/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'bayer.email': email }
      const result = await jobsCollections.find(query).toArray()
      res.send(result)
    })
    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollections.deleteOne(query);
      res.send(result)
    })
    app.get('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollections.findOne(query);
      res.send(result)
    })

    app.put('/update-job/:id', async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const query = { _id: new ObjectId(id) }
      const updatedJob = {
        $set: jobData
        
      }
      const options = { upsert: true }
      const result = await jobsCollections.updateOne(query, updatedJob, options);
      res.send(result)
    })


    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello from SoloSphere Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
