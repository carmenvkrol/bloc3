'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Article = mongoose.model('Article'),
  _ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
  res.jsonp(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
  var article = req.article;

  article = _.extend(article, req.body);

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
  Article.find({ user: req.user.id }).sort('-created').populate('user', 'displayName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
  Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article ' + id));
    req.article = article;
    next();
  });
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.article.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};

exports.tags = function(req, res) {
  var rawTags = [];
  var articleTags = [];
  var articleID;
  var completeTags = {};
  var completeTagsName = [];

  Article.find( { user: req.user.id }).exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < articles.length; i++) {
        articleTags = articles[i].tags;
        for (var j = 0; j < articleTags.length; j++) {
          rawTags.push(articleTags[j].text);
      }
    }
      var tags = _.uniq(rawTags);
      for (var k = 0; k < tags.length; k++) {
        var tag = tags[k];
        completeTags[tag] = {};
        completeTags[tag].original = tag;
        completeTags[tag].bookmarks = [];
        for (var m = 0; m < articles.length; m++) {
          articleTags = articles[m].tags;
          articleID = articles[m]._id;
          for (var n = 0; n < articleTags.length; n++) {
            if (tag === articleTags[n].text) {
              completeTags[tag].bookmarks.push(articleID);
            }
          }
        }
      }
      res.jsonp(completeTags);
    }
  });

};
