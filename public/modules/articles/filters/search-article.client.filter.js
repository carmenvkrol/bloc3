'use strict';

angular.module('articles').filter('searchArticle', [
	function() {
		return function(items, searchText) {

      var filtered = [];

      angular.forEach(items, function(item) {
        if( item.label.indexOf(searchText) >= 0 ) filtered.push(item);
      });

			return filtered;
		};
	}
]);