const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/mern-todo")
    .then(() => console.log("Connected to DB"))
    .catch(console.error);

const Todo = require("./modules/Todo");

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();

    res.json(todos);
});

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save();
    res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Document not found' });
    }
  
    const result = await Todo.findOneAndDelete({ _id: req.params.id });
    res.json(result);
});

app.get('/todo/complete/:id', async(req, res) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return res.status(404).json({ error: 'Document not found' });
    }
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
})


app.listen(3001, () => console.log("Server started on port 3001"));
