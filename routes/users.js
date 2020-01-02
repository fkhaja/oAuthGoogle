var express = require('express');
var router = express.Router();
const auth = require('./auth');
const {google} = require('googleapis');
const people = google.people('v1');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let oauth2Client = auth.getOAuthClient();
    let session = req.session;
    let token = session["tokens"];
    // console.log('Tokens \n' + token);
    oauth2Client.setCredentials(token);
    console.log('Credentials set');

    var p = new Promise(function(resolve, reject) {
        people.people.get({ auth: oauth2Client, resourceName: 'people/me',
            personFields: 'emailAddresses,names,photos'}, function(err, response) {
            console.log("response : ", response);
            resolve(response || err);
        });
    }).then(function(data) {
        console.log(JSON.stringify(data));
        res.send(`<html><body>
            <img src=${data.data.photos[0].url} />
            <h3>Hello ${data.data.names[0].displayName}</h3>
            </body>
            </html>
        `);
    }).catch(function(e) {
        res.send(e);
    });
});

module.exports = router;
