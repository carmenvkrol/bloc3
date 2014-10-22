'use strict';

angular.module('articles').filter('articlesByTag', [
  function() {
    return function(articles, tag) {

      var filtered = [];

      if (tag === undefined) {
        return articles;
      }

      var tags;

      angular.forEach(articles, function(article) {
        tags = article.tags.map(function (tag) {
          return tag.text;
        });

        if ( tags.indexOf(tag) !== -1 ) {
          filtered.push(article);
        }
      });

      return filtered;
    };
  }
]);
