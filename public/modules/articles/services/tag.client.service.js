'use strict';

var TagService = (function () {
  function TagService($http) {
    this.http = $http;
  }

  TagService.prototype.findTags = function() {
    return this.http.get('/article_tags');
  };

  TagService.prototype.getArticles = function() {
    return this.http.get('/articles');
  };

  TagService.prototype.updateTag = function(theTag) {
    return this.http.post('/article_tags', theTag);
  };

  TagService.prototype.deleteTag = function(theTag) {
    return this.http.delete('/article_tags/' + theTag);
  };

  TagService.$inject = ['$http'];

  angular.module('articles').service('TagService', TagService);

  return TagService;

}());
