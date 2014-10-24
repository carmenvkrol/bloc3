'use strict';

angular.module('articles').filter('articlesByTag', [
  function() {
    return function(articles, selectedTags) {

      var filtered = [];

      if (selectedTags.length === 0) {
        return articles;
      }

      var tags;
      var intersect;

      angular.forEach(articles, function(article) {
        tags = article.tags.map(function (tag) {
          return tag.text;
        });

        intersect = _.intersection(tags, selectedTags);

        if (intersect.length === selectedTags.length) {
          filtered.push(article);
        }

      });

      return filtered;
    };
}
]);
