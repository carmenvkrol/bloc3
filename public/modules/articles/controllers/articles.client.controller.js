'use strict';

angular.module('articles').controller('ArticlesController', ['$http', '$scope', '$stateParams', '$location', '$timeout', '$resource', 'Authentication', 'Articles',
  function($http, $scope, $stateParams, $location, $timeout, $resource, Authentication, Articles) {

    $scope.authentication = Authentication;

    $scope.create = function() {
      var article = new Articles({
        title: this.title,
        link: this.link,
        content: this.content,
        tags: this.tags
      });
      article.$save(function(response) {
        $location.path('articles');

        $scope.title = '';
        $scope.link = '';
        $scope.content = '';
        $scope.tags = '';
        $scope.find();
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function( article ) {
      if ( article ) { article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }

        $scope.find();

      } else {
        $scope.article.$remove(function() {
          $location.path('articles');
        });
      }
    };

    $scope.update = function() {
      var article = $scope.article;

      article.$update(function() {
        $location.path('articles');
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function() {
      $scope.articles = Articles.query();
    };

    $scope.findOne = function() {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };

    $scope.findTags = function() {
       var rawTags = {};

       $http
          .get('/article_tags')
          .success(function(data){
              rawTags = data;
              for (var prop in rawTags) {
                $scope.tags.push(prop);
              }
           })
           .error(function(){
           });

        $scope.tags = [];
    };

  // selected tags
  $scope.selection = [];

  // toggle selection for a given tag by name
  $scope.toggleSelection = function toggleSelection(tag) {
    var idx = $scope.selection.indexOf(tag);

    // is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.selection.push(tag);
    }
  };

  var tags = $resource('/article_tags');

  }
]);
