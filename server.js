const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// Define a schema for todos
const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
    createTag: { type: Date, default: Date.now },
  },
  { collection: "todos" }
);

// Define a model for todos
const Todo = mongoose.model("Todo", todoSchema);

// Index page
app.get("/", (req, res) => {
  res.send(
    "This is backend for Todo React Demo App! To get all todos, go to /todos."
  );
});

// FETCH ALL TODOS
app.get("/todos", async (req, res) => {
  try {
    // Retrieve all todos from the "todos" collection
    const todos = await Todo.find();

    // Return the array of todos
    res.json(todos);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error while retrieving all todos" });
  }
});

// CREATE TODO
app.post("/todos", async (req, res) => {
  try {
    // Create a new todo document
    const todo = new Todo({
      text: req.body.text,
    });

    // Save the todo document
    await todo.save();

    // Return the newly created todo document
    res.json(todo);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error while creating a new todo" });
  }
});

// UPDATE TODO
app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const { text, checked } = req.body;
  try {
    // Find the todo document by its id
    const todo = await Todo.findOneAndUpdate(
      id,
      { text, checked },
      { new: true }
    );

    // If the document doesn't exist
    if (!todo) {
      return res.status(404).json({ error: "No todo with given id" });
    }

    // Update the todo document
    // todo.checked = req.body.checked;
    // await todo.save();

    // Return success response
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error while updating a todo" });
  }
});

// DELETE TODO
app.delete("/todos/:id", async (req, res) => {
  try {
    // Find the todo document by its id and delete it
    const todo = await Todo.findByIdAndDelete(req.params.id);

    // If the document doesn't exist
    if (!todo) {
      return res.status(404).json({ error: "No todo with given id" });
    }

    // Return success response
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Internal server error while deleting a todo" });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
