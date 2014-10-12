'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  url = require('url'),
  SpotifyStrategy = require('passport-spotify').Strategy,
  config = require('../config'),
  users = require('../../app/controllers/users');

module.exports = function() { 

var appKey = '4d0dce5db26c45048472d4770a5866f3';
var appSecret = 'ea3072d048bf4addb2b4f04763e2dd41';

  passport.use(new SpotifyStrategy({
    clientID: appKey,
    clientSecret: appSecret,
    callbackURL: 'http://localhost:3000/auth/spotify/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
};