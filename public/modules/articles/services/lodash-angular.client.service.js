'use strict';

angular.module('articles').factory('_', [
	'$window',
	function($window) {
		// Lodash angular service logic
		// ...

		// Public API
		return $window._;
	}
]);