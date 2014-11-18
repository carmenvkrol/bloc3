'use strict';

angular.module('articles').controller('TagsController', ['$http', '$scope', '$stateParams', '$location', '$timeout', '$resource', '$q', 'Authentication', 'Articles',
	function($http, $scope, $stateParams, $location, $timeout, $resource, $q, Authentication, Articles) {

    $scope.articles = [];

    //MAKE THIS INTO SERVICE IF KEEP USING
    $scope.findTags = function() {
       $http
          .get('/article_tags')
          .success(function(data){
              $scope.tags = data;
           })
           .error(function(){
           });

        $scope.tags = [];
    };

    $scope.getArticles = function() {
      return $http
        .get('/articles')
        .success(function(data){
          $scope.articles = data;
        })
        .error(function(){
          console.log('error in getArticles');
        });
    };

    $scope.updateArticle = function(article) {
      return $http.put('/articles/' + article._id, article).success(function(article){
        $scope.article = article;
      });
    };

    $scope.updateTag = function(key) {
      var val = this.val;
      var updateKey = this.key;
      var oldKey = this.val.original;
      var promise = $scope.getArticles();

      promise.then(function(){
        angular.forEach($scope.articles, function(article){
          for (var i=0; i < val.bookmarks.length; i++) {
            if (val.bookmarks[i] === article._id) {
              for (var j=0; j<article.tags.length; j++) {
                if (article.tags[j].text === oldKey) {
                  article.tags[j].text = updateKey;
                }
                $scope.updateArticle(article);
              }
            }
          }
        });
      });
    };

    $scope.deleteTag = function(tag) {
        var updateCalls = [];
        var promise = $scope.getArticles();

        promise.then(function() {
          angular.forEach($scope.articles, function(article){
            for (var i=0; i<article.tags.length; i++) {
              if (tag === article.tags[i].text) {
                article.tags.splice(i,1);
                updateCalls.push($scope.updateArticle(article));
              }
            }
          });
          $q.all(updateCalls).then(function () {
            $scope.findTags();
          });
        });
    };

    $scope.showMessage = function(message) {
      $scope.message = message;
      return true;
    };
	}
]);
