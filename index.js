const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors =require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res )=> {
  res.send('Tour Asia server is Running')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5to1lc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const tourSpotCollection = client.db('tourSpotDB').collection('tourSpots')
    

    app.get('/tourSpots', async(req, res) =>{
      const cursor = tourSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    

    

    app.get('/tourSpots/:email', async(req, res) =>{
      const result = await tourSpotCollection.find({email:req.params.email}).toArray();
      res.send(result)
  })


    app.post('/tourSpots', async(req,res)=>{
      const newTourSpot = req.body;
      console.log(newTourSpot);
      const result = await tourSpotCollection.insertOne(newTourSpot);
      res.send(result)
    }) 

    app.put('/tourSpots/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = {upset: true};
      const updatedSpot = req.body;
      const spot = {
        $set: {
          spotName: updatedSpot.spotName,
          countryName: updatedSpot.countryName,
          location: updatedSpot.location,
          shortDescription: updatedSpot.shortDescription,
          averageCost: updatedSpot.averageCost,
          seasonality: updatedSpot.seasonality,
          travelTime: updatedSpot.travelTime,
          visitor: updatedSpot.visitor,
          image: updatedSpot.image
        }
      }
      const result = await tourSpotCollection.updateOne(filter,spot,option)
      res.send(result);
    })

    app.delete('/tourSpots/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tourSpotCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);




app.listen(port, ()=>{
  console.log(`coffee server is running on port: ${port}`);
})