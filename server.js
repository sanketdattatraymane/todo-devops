const express = require("express");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// AWS REGION
AWS.config.update({ region: "ap-south-1" });

// DynamoDB client
const db = new AWS.DynamoDB.DocumentClient();
const TABLE = "TodoTable";

// GET all todos
app.get("/todos", async (req, res) => {
  try {
    const data = await db.scan({ TableName: TABLE }).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD todo
app.post("/todos", async (req, res) => {
  const todo = {
    id: uuidv4(),
    text: req.body.text
  };

  try {
    await db.put({ TableName: TABLE, Item: todo }).promise();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
