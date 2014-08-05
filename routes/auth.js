var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

//Twitter library and keys
// var OAuth = require('oauth').OAuth;

var passport = require('passport')
var OAuthStrategy = require('passport-oauth').OAuthStrategy;

var accessFile = path.join (__dirname, '../twitterapi.json');
var twitterAccess = JSON.parse(fs.readFileSync(accessFile, 'utf8'));

passport.use('twitter', new OAuthStrategy({
    //authorizationURL: 'https://www.provider.com/oauth2/authorize',
    userAuthorizationURL: 'https://api.twitter.com/oauth/authorize',
    requestTokenURL: 'https://api.twitter.com/oauth/request_token',
    accessTokenURL: 'https://api.twitter.com/oauth/access_token',
    callbackURL: twitterAccess.callbackURL,
    consumerKey: twitterAccess.key,
    consumerSecret: twitterAccess.keySecret
  },

  function(token, tokenSecret, profile, done) {
    profile.token = token;
    profile.tokenSecret = tokenSecret;
    done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
router.get('/twitter', passport.authenticate('twitter'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

function key(){
  this.data = null;
}

key.prototype.withAppAccess = function(){
  this.data = {
    consumer_key: twitterAccess.key,
    consumer_secret: twitterAccess.keySecret,
    access_token: twitterAccess.token,
    access_token_secret: twitterAccess.tokenSecret
  };
  return this;
};

key.prototype.withUserAccess = function(token, tokenSecret){
  this.data = {
    consumer_key: twitterAccess.key,
    consumer_secret: twitterAccess.keySecret,
    access_token: token,
    access_token_secret: tokenSecret
  };
  return this;
};

module.exports = {router: router, key: key};

