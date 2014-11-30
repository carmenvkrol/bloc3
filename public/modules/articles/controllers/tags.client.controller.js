'use strict';

var TagsController = (function () {
  function TagsController(TagService) {
    this.TagService = TagService;
    this.articles = [];
    this.tags = {};
    this.message = '';
  }

  TagsController.prototype.tagService = function (operation, args, message) {
    var vm = this;

    this.TagService[operation](args).then(function (response) {
      vm.tags = response.data;
      vm.message = message;
    });
  };

  TagsController.$inject = ['TagService'];

  angular.module('articles').controller('TagsController', TagsController);

  return TagsController;
})();
