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
        const servicesCollection = database.collection('offerings');


        //GET API
        app.get('/offerings', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET single service
        app.get('/offerings/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/offerings', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result);
        })

        //DELETE API
        app.delete('/offerings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
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
