const express = require("express");
const {Client} = require("pg");

require("dotenv").config(); // โหลดค่าจากไฟล์ .env

const connection = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

connection.connect();

const app = express();

app.use(express.json());

// get all
app.get("/products", async (req, res) => {
  try {
    const results = await connection.query("SELECT * FROM public.products");
    res.send(results.rows);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// get one
app.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await connection.query(
      "SELECT * FROM public.products WHERE ID = $1",
      [id]
    );
    res.send(results.rows);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// create
app.post("/product", async (req, res) => {
  try {
    const {id, name, about, price} = req.body;
    const results = await connection.query(
      "INSERT INTO public.products(id, name, about, price) VALUES ($1, $2, $3, $4)",
      [id, name, about, price]
    );
    res.send({message: "Product Create Successfully!"});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// update
app.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const {name, about, price} = req.body;
    const results = await connection.query(
      "UPDATE public.products SET name=$1, about=$2, price=$3 WHERE ID = $4;",
      [name, about, price, id]
    );

    res.send({message: "Product Update Successfully!"});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// delete
app.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await connection.query(
      "DELETE FROM public.products WHERE ID = $1;",
      [id]
    );
    res.send({message: "Product Delete Successfully!"});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
