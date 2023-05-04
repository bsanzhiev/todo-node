const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ObjectID } = require("mongodb");
const app = express();

// Node.js MongoDB Driver connection string
// Load environment variables from .env file
dotenv.config();

// Middleware for parsing request bodies
app.use(express.json());

// MongoDB connection URL and database name
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;
const dbName = "tododb";

app.get("/", (req, res) => {
  res.send("This is backend server for Todo React Demo App! To get all todos, go to /todos");
});

// Define a route for creating a new todo
app.post("/todos", async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    // Create a new todo document
    const todo = {
      text: req.body.text,
      checked: false,
      createTag: Date.now()
    };

    // Insert the new todo into the "todos" collection
    const result = await db.collection("todos").insertOne(todo);

    // Return the new todo object with an assigned ID
    res.status(201).json({
      id: result.insertedId,
      text: todo.text,
      checked: todo.checked,
      createTag: todo.createTag,
    });

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error wiii uuu" });
  }
});

// Define a route for retrieving all todos
app.get("/todos", async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    // Retrieve all todos from the "todos" collection
    const todos = await db.collection("todos").find().toArray();

    // Return the array of todos
    res.json(todos);

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error hahaha" });
  }
});

// Define a route for updating a todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);

    // Update the specified todo document
    const result = await db
      .collection("todos")
      .updateOne(
        { _id: ObjectID(req.params.id) },
        { $set: { text: req.body.text, checked: req.body.checked } }
      );

    // If no document was updated, return a 404 response
    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    // Return a success response
    res.status(204).end();

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a route for deleting a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);

    // Delete the specified todo document
    const result = await db
      .collection("todos")
      .deleteOne({ _id: ObjectID(req.params.id) });

    // If no document was deleted, return a 404 response
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    // Return a success response
    res.status(204).end();

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at port:${PORT}`);
});
