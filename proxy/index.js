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

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var authorizationData;
var tokenExpirationDate;
var refreshExpirationDate;

async function obtainToken(code, verification) {
    const accessTokenRequestBody = `grant_type=authorization_code&redirect_uri=${redirect}&client_id=${clientId}&client_secret=${clientSecret}&code_verifier=${verification}&code=${code}&scope=openid`;
    accessTokenResponse = await fetch(`${tokenEndpoint}`, {
        body: accessTokenRequestBody,
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    authorizationData = await accessTokenResponse.json();
    tokenExpirationDate = Date.now() + (authorizationData.expires_in * 1000);
    refreshExpirationDate = Date.now() + (authorizationData.refresh_expires_in * 1000);
    return null;
}

async function renewToken(refreshToken) {
    const refreshRequestBody = `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`;
    const refreshResponse = await fetch(`${tokenEndpoint}`, {
        body: refreshRequestBody,
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    authorizationData = await refreshResponse.json();
    tokenExpirationDate = Date.now() + (authorizationData.expires_in * 1000);
    refreshExpirationDate = Date.now() + (authorizationData.refresh_expires_in * 1000);
    return null;
}

async function revokeToken(token, refreshToken) {
    const revokeRequestBody = `client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`;
    await fetch(`${logoutEndpoint}`, {
        body: revokeRequestBody,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    return null;
}

function controllAccessTokenExpirationDate() {
    const timestamp = Date.now();
    if (timestamp >= tokenExpirationDate && timestamp < refreshExpirationDate) {
        console.log('>$ Token expired! Requesting renew... PENDING');
        renewToken(authorizationData.refresh_token).then(() => {
            console.log('>$ Token has been renewed. OK');
            return true;  // If token was renewed successfully.
        }).catch(error => {
            console.error(`>! Cannot renew token due to:\n${error}`);
            return false;  // If couldn't renew the token.
        });
    } else if (timestamp < tokenExpirationDate) {
        console.log('>$ Token still active. OK');
        return true;  // If token still valid.
    }
    console.log('>! Unexpected error occured. FAILURE');
    return false;  // Otherwise.
}

// >> Endpoints <<

// >> /
// README endpoint
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

// >> /oauth
// check Authorization Server connection
app.get('/oauth', (req, res) => {
    fetch(`${issuer}`)
        .then(response => response.json().then(data => {
            console.log('>$ Connection with Authorization Server established. OK');
            res.send(data);
        }))
        .catch(error => {
            console.error(`>! Connecting failed due to:\n${error}`);
            res.send();
        });
});
// START flow
app.post('/oauth/init', (req, res) => {
    console.log('>$ Initializing OAuth2.0 flow for Confidential Proxy. PENDING');
    const authorizationCode = req.query.code;
    const codeVerifier = req.body.code_verifier;
    obtainToken(authorizationCode, codeVerifier)
        .then(() => {
            console.log('>$ Authorization successful. Access token obtained & safly stored. OK');
            res.json({ 'status': 'OK' });
        })
        .catch(error => {
            console.error(`>! Authorization failed due to:\n${error}`);
            res.json({ 'status': 'FAILURE' });
        });
});
// Identify logged user
app.get('/oauth/userinfo', (req, res) => {
    const translatedToken = jwt(authorizationData.access_token);
    res.json({
        ...translatedToken.realm_access,
        'nick': translatedToken.preferred_username,
    });
});
// END session
app.get('/oauth/end', (req, res) => {
    console.log('>$ Ending session... PENDING');
    revokeToken(authorizationData.access_token, authorizationData.refresh_token)
        .then(() => {
            console.log('>$ Session terminated. OK');
            res.json({ 'status': 'OK' });
        })
        .catch(error => {
            console.error(`>! Termination failed due to:\n${error}`);
            res.json({ 'status': 'FAILURE' });
        });
});

// >> /forward
app.get('/forward', (req, res) => {
    if (controllAccessTokenExpirationDate()) {
        switch (req.query.request) {
            case 'userpublic':
                console.log('>$ Received forwarding request for userpublic. PENDING');
                const userPublicRequest = fetch(`${apiURL}/user/public/data`, {
                    headers: {
                        Authorization: `Bearer ${authorizationData.access_token}`
                    }
                });
                const userPublicResponse = userPublicRequest
                    .then(response => {
                        console.log(`>$ Received response from ${apiURL}/user/public/data. OK`);
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`>! Cannot forward due to:\n${error}`);
                        res.json({ 'status': 'proxy-error', 'authorized': false, 'data': '' });
                    });
                userPublicResponse.then(data => res.json(data));
                break;
            case 'userprivate':
                console.log('>$ Received forwarding request for userprivate. PENDING');
                const translatedToken = jwt(authorizationData.access_token);
                const userPrivateRequest = fetch(`${apiURL}/user/private/${translatedToken.preferred_username}`, {
                    headers: {
                        Authorization: `Bearer ${authorizationData.access_token}`
                    }
                });
                const userPrivateResponse = userPrivateRequest
                    .then(response => {
                        console.log(`>$ Received response from ${apiURL}/user/private/${translatedToken.preferred_username}. OK`);
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`>! Cannot forward due to:\n${error}`);
                        res.json({ 'status': 'proxy-error', 'authorized': false, 'data': '' });
                    });
                userPrivateResponse.then(data => res.json(data));
                break;
            case 'adminpublic':
                console.log('>$ Received forwarding request for adminpublic. PENDING');
                const adminPublicRequest = fetch(`${apiURL}/admin/public/data`, {
                    headers: {
                        Authorization: `Bearer ${authorizationData.access_token}`
                    }
                });
                const adminPublicResponse = adminPublicRequest
                    .then(response => {
                        console.log(`>$ Received response from ${apiURL}/admin/public/data. OK`);
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`>! Cannot forward due to:\n${error}`);
                        res.json({ 'status': 'proxy-error', 'authorized': false, 'data': '' });
                    });
                adminPublicResponse.then(data => res.json(data));
                break;
            default:
                break;
        }
    }
});

// !!! TO DELETE !!! /tmp endpoints
app.get('/tmp/data', (req, res) => {
    res.send(authorizationData);
});

const port = 5000;
app.listen(port, () => console.log(`>$ Proxy server STARTED\n>$ Listening on port ${port}.`));
