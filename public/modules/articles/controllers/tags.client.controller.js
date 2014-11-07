'use strict';

angular.module('articles').controller('TagsController', ['$http', '$scope', '$stateParams', '$location', '$timeout', '$resource', 'Authentication', 'Articles',
	function($http, $scope, $stateParams, $location, $timeout, $resource, Authentication, Articles) {

    var articles = [];

    //MAKE THIS INTO SERVICE IF KEEP USING
    $scope.findTags = function() {

       $http
          .get('/article_tags')
          .success(function(data){
              $timeout(function() {
                $scope.tags = data;
                console.log(data);
              });
           })
           .error(function(){
           });

        $scope.tags = [];
    };

    $scope.getArticles = function() {
      $http
        .get('/articles')
        .success(function(data){
          $timeout(function(){
            articles = data;
          });
        })
        .error(function(){
        });
    };

    $scope.updateArticle = function(article) {
      $http
        .put('/articles/' + article._id, article)
        .success(function(article){
            article;
        });
    };

    $scope.updateTag = function() {

      var val = this.val;
      var updateKey = this.key;
      var oldKey = this.val.original;
      //console.log(oldKey);

      $scope.getArticles();

      angular.forEach(articles, function(article){
        for (var i=0; i < val.bookmarks.length; i++) {
          if (val.bookmarks[i] === article._id) {
            article.tags.push({'text':updateKey});
            console.log(article);
            $scope.deleteTag(oldKey);
            $scope.updateArticle(article);
          }
        }
      });

    };

    $scope.deleteTag = function(tag) {

        $scope.getArticles();

        angular.forEach(articles, function(article){
            for (var i=0; i<article.tags.length; i++) {
              if (tag === article.tags[i].text) {
                article.tags.splice(i,1);
                $scope.updateArticle(article);
              }
            }

            $scope.findTags();

        });

      };
	}
]);
