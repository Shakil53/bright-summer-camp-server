const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middle ware
app.use(express.json())
app.use(cors())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u7o1gfd.mongodb.net/?retryWrites=true&w=majority`;

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


        const courseCollection = client.db("brightSummerCamp").collection("courses")
        const bookingCollection = client.db("brightSummerCamp").collection("bookings")


        //bright-summer-camp courses-------get
        app.get('/courses', async (req, res) => {
            const cursor = courseCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {

                // Include only the `title` and `imdb` fields in the returned document
                projection: { name: 1, details: 1, rating: 1, price: 1, img: 1, icon: 1 }
            };
            const result = await courseCollection.findOne(query, options)
            res.send(result)
        })
        //booking enrollment
        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            console.log(bookings)
            const result = await bookingCollection.insertOne(bookings)
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
    res.send('summer is comming')
})

app.listen(port, () => {
    console.log(`Bright Summer Camp running on port ${port}`);
})