'use strict';

angular.module('articles').factory('Tags', ['$resource',
	function($resource) {
		return $resource('articles_tags', {
			update: {
				method: 'GET'
			}
		});
	}
]);