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
        const dataCollection = client.db("tableData").collection("data");
        const userCollection = client.db("tableData").collection("users");
        const productCollection = client.db("tableData").collection("products");

        app.get("/data", async(req, res)=>{
            const query = {};
            const result = await dataCollection.find(query).toArray();
            res.send(result);
        })

        app.get("/data/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await dataCollection.findOne(query);
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

        app.put("/edit/:id", async(req, res)=>{
            const id = req.params.id;
            const result = await dataCollection.updateOne(
              { _id: ObjectId(id) },
              { $set: req.body }
            );
            res.send(result);
        })

        app.delete("/data/:id", async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await dataCollection.deleteOne(query);
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