const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
const collection = "blog";

// server side
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET request
app.get('/getBlog', (req, res) => {
    // db connection
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    })
})

// PUT request
app.put('/:id', (req, res) => {
    const blogID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(blogID) }, { $set: { blog: userInput.blog } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    })
})

// post request
app.post('/', (req, res) => {
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json({ result: result, document: result.ops[0] });
        }
    })
})

// DELETE request
app.delete('/:id', (req, res) => {
    const blogID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(blogID) }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
})

// CHECK
db.connect((err) => {
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log('conncted to databse, app listening on port 3000');
        });
    }
})
