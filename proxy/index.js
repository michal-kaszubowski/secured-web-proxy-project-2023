const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jwt-decode');
require('dotenv').config()

// >> Auth Server Info Section <<
const issuer = process.env.ISSUER;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirect = process.env.REDIRECT_URL;
const tokenEndpoint = process.env.TOKEN_ENDPOINT;

var authorizationData;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// >> Endpoints <<

// README endpoint
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

// CHECK MY REQUEST endpoint
app.post('/', (req, res) => res.send({
    params: req.query,
    body: req.body
}));

// check Authorization Server connection
app.get('/oauth', (req, res) => {
    fetch(`${issuer}`)
        .then(response => response.text().then(text => res.send(text)))
        .catch(error => console.error(error));
});

// START proxy flow
app.post('/oauth/init', (req, res) => {
    const authorizationCode = req.query.code;
    const codeVerifier = req.body.code_verifier;
    const body = `grant_type=authorization_code&redirect_uri=${redirect}&client_id=${clientId}&client_secret=${clientSecret}&code_verifier=${codeVerifier}&code=${authorizationCode}&scope=openid`;

    fetch(`${tokenEndpoint}`, {
        body: body,
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
        .then(response => response.json().then(data => {
            authorizationData = data;
            res.send('Got response from the Auth Server.')
        }))
        .catch(() => console.error('Error occured. Not displayed due to security reasons.'));
});

// Identify logged user
app.get('/oauth/userinfo', (req, res) => {
    const translatedToken = jwt(authorizationData.access_token)
    res.json({
        ...translatedToken.realm_access,
        'nick': translatedToken.preferred_username,
    });
});

// TO DELETE !!!
app.get('/tmp/data', (req, res) => {
    res.send(authorizationData);
});

const port = 5000;
app.listen(port, () => console.log(`Server is UP & RUNNING!\nListening on port ${port}...`));
