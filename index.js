const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.hdpgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travellica-travel-companion');
        const offeringsCollection = database.collection('offerings');
        const bookingsCollection = database.collection('bookings');


        //GET offerings API
        app.get('/offerings', async (req, res) => {
            const cursor = offeringsCollection.find({});
            const offerings = await cursor.toArray();
            res.send(offerings);
        })

        //GET offerings API
        app.get('/bookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        //GET single offering
        app.get('/offerings/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific offering', id);
            const query = { _id: ObjectId(id) };
            const offering = await offeringsCollection.findOne(query);
            res.json(offering);
        })

        //POST offering API
        app.post('/offerings', async (req, res) => {
            const offering = req.body;
            console.log('Hit the post API', offering);

            const result = await offeringsCollection.insertOne(offering);
            console.log(result);

            res.json(result);
        })

        //POST booking API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log('Hit the post API', booking);

            const result = await bookingsCollection.insertOne(booking);
            console.log(result);

            res.json(result);
        })

        //DELETE offerings API
        app.delete('/offerings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await offeringsCollection.deleteOne(query);
            res.json(result);
        })

        //DELETE bookings API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running travellica server...');
})

app.listen(port, () => {
    console.log('Running on port', port);
})
