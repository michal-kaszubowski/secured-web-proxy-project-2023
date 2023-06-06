const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// >> Auth Server Info Section <<
const issuer = 'http://localhost:8080/realms/myrealm';
const clientId = 'wsx2375';
const clientSecret = 'mkDaSyQLBWgCbZoVJG97heFC3s6yxb3S'
const redirect = "http://localhost:3000/oauth"

var authorizationData;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// >> Endpoints <<
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.post('/', (req, res) => res.send({
    params: req.query,
    body: req.body
}));

app.get('/oauth/flow/check', (req, res) => {
    fetch(`${issuer}`)
        .then(response => response.text().then(text => res.send(text)))
        .catch(err => console.error(err));
});

app.post('/oauth/flow/init', (req, res) => {
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

    console.log(authorizationData);

    fetch(`${issuer}/protocol/openid-connect/userinfo`, {
        headers: {
            Authorization: `Bearer ${authorizationData.access_token}`
        }
    })
        .then(response => response.json().then(data => console.log(data)))
        .catch(err => console.error(err));

    res.send('Hello! Proxy here. I received a message!')
});

const port = 5000;
app.listen(port, () => console.log(`Server is UP & RUNNING!\nListening on port ${port}...`));
