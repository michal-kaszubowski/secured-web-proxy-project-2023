const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jwt-decode');
require('dotenv').config();

function authorize(token, scope, user) {
    const verifyRequest = fetch(`${process.env.AUTH_SERVER_URL}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return verifyRequest
        .then(response => {
            response.json().then(data => {
                if (user == null && data.sub) {  // no userId specified and valid token
                    const includes = jwt(token).realm_access.roles.includes(scope) ? true : false;
                    return includes;
                } else if (user !== null && data.preferred_username == user) {  // userId provided and matches name from response
                    const includes = jwt(token).realm_access.roles.includes(scope) ? true : false;
                    return includes;
                }
                return false;
            });
        })
        .catch(error => {
            console.error(error)
            return false;
        });
};

function serve(app, client) {
    // >> /
    // README endpoint
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
    // Check if has access to user API scope

    // >> /check
    app.get('/check/user', (req, res) => {
        const token = req.headers.authorization.slice(7);
        authorize(token, 'user').then(authorized => res.send(authorized));
    });

    // >> /user
    // GET common data for regular users
    app.get('/user/public/data', (req, res) => {
        console.log('>$ Received request for /user/public/data. STATUS: PENDING');
        const token = req.headers.authorization.slice(7);
        const response = authorize(token, 'user')
            .then(() => {
                console.log('>$ Authorized request for /user/public/data. STATUS: OK');
                return {
                    'status': 'resolved',
                    'authorized': true,
                    'data': 'This is the user-scope restricted data.'
                };
            })
            .catch(error => {
                console.error(error);
                return {
                    'status': 'unathorized',
                    'authorized': false,
                    'data': ''
                };
            });

        response.then(data => res.json(data));
    });
    // GET specific (id) user data
    app.get('/user/private/:id', (req, res) => {
        const userId = req.params.id;
        const token = req.headers.authorization.slice(7);
        console.log(`>$ Received request for /user/private/${userId}. STATUS: PENDING`)

        const response = authorize(token, 'user', userId)
            .then(() => {
                console.log(`>$ Authorized request for /user/private/${userId}. STATUS: OK`);
                return {
                    'status': 'resolved',
                    'authorized': true,
                    'data': `This is the user-specific data for ${userId}`
                };
            })
            .catch(error => {
                console.error(error);
                return {
                    'status': 'unathorized',
                    'authorized': false,
                    'data': ''
                };
            });

        response.then(data => res.json(data));
    });

    // /admin
    // GET admin-scope specific data
    app.get('/admin/public/data', (req, res) => {
        console.log('>$ Received request for /admin/public/data. STATUS: PENDING');
        const token = req.headers.authorization.slice(7);
        const response = authorize(token, 'admin')
            .then(() => {
                console.log('>$ Authorized request for /admin/public/data. STATUS: OK');
                return {
                    'status': 'resolved',
                    'authorized': true,
                    'data': 'This is the admin-scope restricted data.'
                };
            })
            .catch(error => {
                console.error(error);
                return {
                    'status': 'unathorized',
                    'authorized': false,
                    'data': ''
                };
            });

        response.then(data => res.json(data));
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
