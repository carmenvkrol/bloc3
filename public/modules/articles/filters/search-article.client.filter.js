'use strict';

angular.module('articles').filter('searchArticle', [
	function() {
		return function(items, searchText) {

      var filtered = [];

      if (searchText === undefined) {
        return items;
      }

      angular.forEach(items, function(item) {
        if ( item.title.indexOf(searchText) >= 0 ) {
          filtered.push(item);
        } 
      });

			return filtered;
		};
	}
]);