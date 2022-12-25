const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.4nt1ond.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
    try{
        const userCollection = client.db("tableData").collection("users");
        const productCollection = client.db("tableData").collection("products");
        const allUserCollection = client.db("tableData").collection("allUser");

        app.get("/allUser/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await allUserCollection.findOne(query);
            res.send(result)
        })

        app.get("/products", async(req, res)=>{
            const query = {};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/products", async(req, res)=>{
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })


        app.post("/users", async (req, res) => {
          const user = req.body;
          console.log(user);
          const result = await userCollection.insertOne(user);
          res.send(result);
        });

        // Admin Panel------------------------------------->>>
        app.get("/users/admin/:email", async(req, res)=>{
            const email = req.params.email;
            const query = { email};
            const user = await userCollection.findOne(query);
            res.send({isAdmin: user?.role === "Admin"})
        })

        app.get("/allUser", async(req, res)=>{
            const query = {};
            const result = await allUserCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/allUser", async(req, res)=>{
            const userData = req.body;
            const result = await allUserCollection.insertOne(userData);
            res.send(result);
        })

        app.put("/allUser/:id", async(req, res)=>{
            const id = req.params.id;
            const result = await allUserCollection.updateOne(
              { _id: ObjectId(id) },
              { $set: req.body }
            );
            res.send(result);
        })

        app.delete("/allUser/:id", async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await allUserCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch((e) => console.log(e));



app.get("/", (req, res)=>{
    res.send("Table Data Loaded Soon !!")
})

app.listen(port, ()=>{
    console.log(`Available Port is ${port}`);
})


module.exports = app;