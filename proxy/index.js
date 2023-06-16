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
const logoutEndpoint = process.env.LOGOUT_ENDPOINT;
const apiURL = process.env.API_URL;

var authorizationData;
var translatedToken;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// >> Endpoints <<

// >> /
// README endpoint
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
// CHECK MY REQUEST endpoint
app.post('/', (req, res) => res.send({
    params: req.query,
    body: req.body
}));

// >> /oauth
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
    const requestBody = `grant_type=authorization_code&redirect_uri=${redirect}&client_id=${clientId}&client_secret=${clientSecret}&code_verifier=${codeVerifier}&code=${authorizationCode}&scope=openid`;

    fetch(`${tokenEndpoint}`, {
        body: requestBody,
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
        .then(response => response.json().then(data => {
            authorizationData = data;
            translatedToken = jwt(data.access_token);
            res.send('Got response from the Auth Server.')
        }))
        .catch(() => console.error('Error occured. Not displayed due to security reasons.'));
});
// Identify logged user
app.get('/oauth/userinfo', (req, res) => {
    res.json({
        ...translatedToken.realm_access,
        'nick': translatedToken.preferred_username,
    });
});
// END session
app.get('/oauth/end', (req, res) => {
    const requestBody = `client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${authorizationData.refresh_token}`;
    const logoutRequest = fetch(`${logoutEndpoint}`, {
        body: requestBody,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authorizationData.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    logoutRequest
        .then(() => {
            res.send('Success!')
        })
        .catch(error => console.error(error));
});

// >> /forward
app.get('/forward', (req, res) => {
    switch (req.query.request) {
        case 'userpublic':
            console.log('>$ Received request for userpublic. STATUS: PENDING');
            const userPublicRequest = fetch(`${apiURL}/user/public/data`, {
                headers: {
                    Authorization: `Bearer ${authorizationData.access_token}`
                }
            });
            const userPublicResponse = userPublicRequest
                .then(response => {
                    console.log('>$ Received response for userpublic. STATUS: OK');
                    return response.json();
                })
                .catch(error => {
                    console.error(error);
                    res.json({
                        'status': 'proxy-error',
                        'authorized': false,
                        'data': ''
                    });
                });
            userPublicResponse.then(data => res.json(data));

            break;
        case 'userprivate':
            console.log('>$ Received request for userprivate. STATUS: PENDING');
            const userPrivateRequest = fetch(`${apiURL}/user/private/${translatedToken.preferred_username}`, {
                headers: {
                    Authorization: `Bearer ${authorizationData.access_token}`
                }
            });
            const userPrivateResponse = userPrivateRequest
                .then(response => {
                    console.log('>$ Received response for userprivate. STATUS: OK');
                    return response.json();
                })
                .catch(error => {
                    console.error(error);
                    res.json({
                        'status': 'proxy-error',
                        'authorized': false,
                        'data': ''
                    });
                });
            userPrivateResponse.then(data => res.json(data));

            break;
        case 'adminpublic':
            console.log('>$ Received request for adminpublic. STATUS: PENDING');
            const adminPublicRequest = fetch(`${apiURL}/admin/public/data`, {
                headers: {
                    Authorization: `Bearer ${authorizationData.access_token}`
                }
            });
            const adminPublicResponse = adminPublicRequest
                .then(response => {
                    console.log('>$ Received response for adminpublic. STATUS: OK');
                    return response.json();
                })
                .catch(error => {
                    console.error(error);
                    res.json({
                        'status': 'proxy-error',
                        'authorized': false,
                        'data': ''
                    });
                });
            adminPublicResponse.then(data => res.json(data));

            break;
        default:
            break;
    }
});


// !!! TO DELETE !!!
app.get('/tmp/data', (req, res) => {
    res.send(authorizationData);
});

const port = 5000;
app.listen(port, () => console.log(`Proxy server is listening on port ${port}. STATUS: RUNNING`));
