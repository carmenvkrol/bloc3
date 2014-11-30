'use strict';

angular.module('articles').controller('TagsController', ['$http', '$scope', '$stateParams', '$location', '$timeout', '$resource', '$q', 'Authentication', 'Articles',
	function($http, $scope, $stateParams, $location, $timeout, $resource, $q, Authentication, Articles) {

    $scope.articles = [];
    $scope.tags = {};

    //MAKE THIS INTO SERVICE IF KEEP USING
    $scope.findTags = function() {
       $http
          .get('/article_tags')
          .success(function(data){
            console.log(data);
              $scope.tags = data;
           })
           .error(function(){
           });

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

    $scope.updateTag = function(theTag) {
       $http
          .post('/article_tags', theTag)
          .success(function(data){
            $scope.tags = data;
           })
           .error(function(){
           });
    };

    $scope.deleteTag = function(theTag) {
       $http
          .delete('/article_tags/' + theTag)
          .success(function(data){
            $scope.tags = data;
           })
           .error(function(){
           });
    };

    $scope.showMessage = function(message) {
      $scope.message = message;
      return true;
    };
	}
]);
