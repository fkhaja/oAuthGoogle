var express = require('express');
var router = express.Router();
var { google } = require('googleapis');
const OAuth2Data = require('../resources/credential.json');
var logger = require('morgan');

const CLIENT_ID = OAuth2Data.client_id;
const CLIENT_SECRET = OAuth2Data.client_secret;
const REDIRECT_URL = OAuth2Data.redirect_url;
const SCOPES = ['profile', 'email', 'openid', 'https://www.googleapis.com/auth/drive.metadata.readonly'];

function getOAuthClient () {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
}

function isAuthenticated(req) {
  let session = req.session;
  if (session["tokens"]) {
    return true;
  }
  return false;
}

function getAuthUrl () {
  let oauth2Client = getOAuthClient();
  // generate a url that asks permissions for Google+ and Google Calendar scopes
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES // If you only need one scope you can pass it as string
  });
  logger(url);
  return url;
}

// Mapping for /auth
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/oauthCallback", function (req, res, next) {
  let oauth2Client = getOAuthClient();
  let session = req.session;
  let code = req.query.code;

  oauth2Client.getToken(code, function(err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if(!err) {
      oauth2Client.setCredentials(tokens);
      session["tokens"]=tokens;
      console.log('redirecting to users')
      res.redirect('/users')
    }
    else{
      res.send(`
            <h3>Login failed!!</h3>;
        `);
    }
  });

});

module.exports = {
  router: router,
  getAuthUrl: getAuthUrl,
  isAuthenticated: isAuthenticated,
  getOAuthClient: getOAuthClient
};