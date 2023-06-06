const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jwt-decode');

// >> Auth Server Info Section <<
const issuer = 'http://localhost:8080/realms/myrealm';
const clientId = 'wsx2375';
const clientSecret = 'mkDaSyQLBWgCbZoVJG97heFC3s6yxb3S';
const redirect = 'http://localhost:3000/oauth/intercept';

var authorizationData;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// >> Endpoints <<

// README endpoint
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

// CHECKME endpoint
app.post('/', (req, res) => res.send({
    params: req.query,
    body: req.body
}));

// check Authorization Server connection
app.get('/oauth', (req, res) => {
    fetch(`${issuer}`)
        .then(response => response.text().then(text => res.send(text)))
        .catch(err => console.error(err));
});

// START proxy flow
app.post('/oauth/init', (req, res) => {
    const authorizationCode = req.query.code;
    const codeVerifier = req.body.code_verifier;
    const body = `grant_type=authorization_code&redirect_uri=${redirect}&client_id=${clientId}&client_secret=${clientSecret}&code_verifier=${codeVerifier}&code=${authorizationCode}`;

    fetch(`${issuer}/protocol/openid-connect/token`, {
        body: body,
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
        .then(response => response.json().then(data => authorizationData = data))
        .catch(() => console.error('Error occured. Not displayed due to security reasons.'));

    res.send('Requesting token...')
});

// Identify logged user
app.get('/oauth/userinfo', (req, res) => res.json(jwt(authorizationData.access_token)));

// fetch(`${issuer}/protocol/openid-connect/userinfo`, {
//     headers: {
//         Authorization: `Bearer ${authorizationData.access_token}`
//     }
// })
//     .then(response => response.text()
//         .then(text => res.send(text)))
//     .catch(err => console.error(err));

// TO DELETE !!!
app.get('/tmp/data', (req, res) => {
    res.send(authorizationData);
});

const port = 5000;
app.listen(port, () => console.log(`Server is UP & RUNNING!\nListening on port ${port}...`));
