'use strict';

angular.module('articles').filter('articlesByTag', [
  function() {
    return function(articles, selectedTags) {

      var filtered = [];

      if (selectedTags.length === 0) {
        return articles;
      }

      var tags;

      angular.forEach(articles, function(article) {
        tags = article.tags.map(function (tag) {
          return tag.text;
        });


        var testFunction = function () {
          selectedTags.map(function (tag) {
            return (tags.indexOf(tag) !== -1);
          });
        };

        if(article.tags.every(testFunction)) {
          filtered.push(article);
        }
      });

      return filtered;
    };
}
]);
