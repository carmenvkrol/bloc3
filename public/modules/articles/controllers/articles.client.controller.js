'use strict';

angular.module('articles').controller('ArticlesController', ['$http', '$scope', '$stateParams', '$location', '$timeout', 'Authentication', 'Articles',
	function($http, $scope, $stateParams, $location, $timeout, Authentication, Articles) {
		var tagOnLoad;
		var tagSelected;

		$scope.tagOnLoad = true;

		$scope.tagSelected = false;

		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content,
				tags: this.tags
			});
			article.$save(function(response) {
				$location.path('articles');

				$scope.title = '';
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
			 $http
          .get('/article_tags')
          .success(function(data){
          		$timeout(function() {
          			$scope.tags = data;
          		});
           })
           .error(function(){
           });

        $scope.tags = {};
		};

		$scope.findOneTag = function() {
			$scope.find().then(function (data) {
				$scope.articles = data;
				$scope.articles2 = [];
				data.articles.map(function (article) {
					var tags = article.tags.map(function (tag) {
						return tag.text;
					});
					
					article.tagsReduced = tags;

					if (article.tagsReduced.indexOf('Tag-4') !== -1) {
						$scope.articles.push(article);
						console.log(article);
					}
				});
				
				console.log($scope.articles2);
				
				
				// for (var i=0; i<$scope.articles.length; i++) {
				// 	for (var j=0; j<$scope.articles[i].tags.length; j++) {
				// 		if ($scope.articles[i].tags[j].text === 'Tag-4'){
				// 			$scope.tagSelected = true;
				// 		}
				// 	}
				// }
				// return $scope.tagSelected;
			});
		};
		// 	$http
		// 		.get('/articles')
		// 		.success(function(data){
		// 			$timeout(function(){
		// 				$scope.tagOnLoad = false;
		// 				// $scope.articles = data;
		// 				$scope.articles2 = [];
		// 				data.map(function (article) {
		// 					var tags = article.tags.map(function (tag) {
		// 						return tag.text;
		// 					});
							
		// 					article.tagsReduced = tags;

		// 					if (article.tagsReduced.indexOf('Tag-4') !== -1) {
		// 						$scope.articles.push(article);
		// 						console.log(article);
		// 					}
		// 				});
						
		// 				console.log($scope.articles2);
						
						
		// 				// for (var i=0; i<$scope.articles.length; i++) {
		// 				// 	for (var j=0; j<$scope.articles[i].tags.length; j++) {
		// 				// 		if ($scope.articles[i].tags[j].text === 'Tag-4'){
		// 				// 			$scope.tagSelected = true;
		// 				// 		}
		// 				// 	}
		// 				// }
		// 				return $scope.tagSelected;
		// 			});
		// 		})
		// 		.error(function(){
		// 		});
		// };
	}
]);