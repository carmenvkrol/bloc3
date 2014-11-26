'use strict';

var TagsController = (function () {
  function TagsController(TagService) {
    this.TagService = TagService;
    this.articles = [];
    this.tags = {};
    this.message = '';
  }

  TagsController.prototype.findTags = function() {
    var vm = this;
    this.TagService.findTags().then(function (response) {
      vm.tags = response.data;
    });
  };

  TagsController.prototype.updateTag = function(theTag, message) {
    var vm = this;
    this.TagService.updateTag(theTag).then(function (response) {
      vm.tags = response.data;
      vm.message = message;
    });
  };

  TagsController.prototype.deleteTag = function(theTag, message) {
    var vm = this;
    this.TagService.deleteTag(theTag).then(function (response) {
      vm.tags = response.data;
      vm.message = message;
    });
  };

  TagsController.prototype.displayMessage = function() {
    return this.message.length > 0;
  };

  TagsController.$inject = ['TagService'];

  angular.module('articles').controller('TagsController', TagsController);

  return TagsController;
})();
