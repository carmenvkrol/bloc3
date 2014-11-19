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
    // if (err) {
    //   return res.status(400).send({
    //     message: errorHandler.getErrorMessage(err)
    //   });
    // } else {
      res.jsonp(article);
    // }
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
  var cleanTags = {};
  Article.aggregate([{$match: {'user':new mongoose.Types.ObjectId(req.user.id)}},{$unwind:'$tags'},{$group:{_id:'$tags.text'}}, {$sort:{_id:1}}]).exec(function(err, tags) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (var i = 0; i < tags.length; i++) {
        cleanTags[tags[i]._id] = {original: tags[i]._id};
      }
      res.jsonp(cleanTags);
    }
  });

};

exports.updateTags = function (req, res) {
  var newTag = req.body.newTag;
  var oldTag = req.body.oldTag;
  console.log(req.body);
  Article.update({'tags.text': oldTag},{$set:{'tags.$.text': newTag}},{multi:true}, function (err, results){
    exports.tags(req, res);
  });
};

exports.deleteTags = function (req,res) {
  Article.update({'tags.text': req.params.tag},{$pull: {'tags': {text: req.params.tag}}}, {multi: true}, function (err, results) {
    exports.tags(req, res);
  });
};
