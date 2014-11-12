'use strict';

angular.module('articles').controller('TagsController', ['$http', '$scope', '$stateParams', '$location', '$timeout', '$resource', '$q', 'Authentication', 'Articles',
	function($http, $scope, $stateParams, $location, $timeout, $resource, $q, Authentication, Articles) {

    var articles = [];

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
          articles = data;
          console.log(data);
        })
        .error(function(){
          console.log('error in getArticles');
        });
    };

    $scope.updateArticle = function(article) {
      return $http.put('/articles/' + article._id, article).success(function(article){
        article;
      });
    };

    $scope.updateTag = function(key) {

      var val = this.val;
      var updateKey = this.key;
      var oldKey = this.val.original;
      var promise = $scope.getArticles();

      promise.then(function () {
        angular.forEach(articles, function(article){
          for (var i=0; i < val.bookmarks.length; i++) {
            if (val.bookmarks[i] === article._id) {
              article.tags.push({'text':updateKey});
              $q.all($scope.deleteTag(oldKey)).then(function () {
                $scope.updateArticle(article);
              });
            }
          }
        });
      });
    };

    $scope.deleteTag = function(tag) {
        var updateCalls = [];
        var promise = $scope.getArticles();
        
        promise.then(function (){
          angular.forEach(articles, function(article){
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
          return updateCalls;
        });  
    };
	}
]);
