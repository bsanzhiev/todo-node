const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 8080;
const mongoUrl = process.env.MONGODB_URL || 'mongodb+srv://bator:DaI0P8LJQrpjRrDm@cluster0.d7giokq.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'tododb';
const collectionName = 'todos';

app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.json({msg: 'Hello world!!!'});
// });

MongoClient.connect(mongoUrl)
  .then(client => {
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Create a new todo
    app.post('/todos', (req, res) => {
      const { id, text, checked } = req.body;
      const todo = { id, text, checked };
      collection.insertOne(todo, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(201).send(result.ops[0]);
      });
    });

    // Get all todos
    app.get('/todos', (req, res) => {
      collection.find({}).toArray((err, docs) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.status(200).send(docs);
      });
    });

    // Get a todo by ID
    app.get('/todos/:id', (req, res) => {
      const id = new ObjectID(req.params.id);
      collection.findOne({ _id: id }, (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        if (!doc) {
          return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(200).send(doc);
      });
    });

    // Update a todo by ID
    app.put('/todos/:id', (req, res) => {
      const id = new ObjectID(req.params.id);
      const { text, checked } = req.body;
      collection.findOneAndUpdate(
        { _id: id },
        { $set: { text, checked } },
        { returnOriginal: false },
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }
          if (!result.value) {
            return res.status(404).send({ message: 'Todo not found' });
          }
          res.status(200).send(result.value);
        }
      );
    });

    // Delete a todo by ID
    app.delete('/todos/:id', (req, res) => {
      const id = new ObjectID(req.params.id);
      collection.deleteOne({ _id: id }, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: 'Todo not found' });
        }
        res.status(204).send();
      });
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
