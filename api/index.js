const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

function authorize(token, scope) {
    const verifyRequest = fetch(`${process.env.AUTH_SERVER_URI}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // verifyRequest.then(response => response.json().then(data => console.log(data)))
};

function serve(app, client) {
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

    app.get('/user/public/data', (req, res) => {
        res.send('This is user-scope restricted data.')
    });

    const listeningPort = 8000;
    app.listen(listeningPort, () => {
        console.log(`API server is listening on port: ${listeningPort}. STATUS: RUNNING`)
    });
};

const expressInstance = express();
expressInstance.use(bodyParser.json());


const mongoClient = new MongoClient('mongodb://localhost:27017');

mongoClient.connect().then(connected => serve(expressInstance, mongoClient))
// >> I intentionally don't use .catch here because I want it to crash on error! <<
