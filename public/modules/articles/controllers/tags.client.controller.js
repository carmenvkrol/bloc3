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
                $scope.tags.sort();
              });
           })
           .error(function(){
           });

        $scope.tags = {};
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
      var tag = $scope.tag;

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