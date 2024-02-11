const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// midlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwapsgs.mongodb.net/?retryWrites=true&w=majority`;


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
        const taskCollection = client.db('taskDB').collection('tasks')


        app.post('/tasks', async (req, res) => {
            const newTasks = req.body;
            console.log(newTasks);
            const result = await taskCollection.insertOne(newTasks);
            res.send(result);

        });


        app.patch("/updateData/:id", async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    taskName: data.taskName,
                   
                }
            }

            const result = await taskCollection.updateOne(query, updatedDoc);
            res.send(result)

        })


        app.get("/tasks", async (req, res) => {
            const result = await taskCollection.find()
                .toArray([]);
            res.send(result);
        });

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log('plz delete from database', id);
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);

        });

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query);
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
    res.send('to-do-list are running')
});

app.listen(port, () => {
    console.log(`to-do list running on port:${port}`);

})