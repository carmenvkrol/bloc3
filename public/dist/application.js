'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('tags', {
      url: '/tags',
      templateUrl: 'modules/articles/views/tags.client.view.html'
    }).state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$http',
  '$scope',
  '$stateParams',
  '$location',
  '$timeout',
  '$resource',
  'Authentication',
  'Articles',
  function ($http, $scope, $stateParams, $location, $timeout, $resource, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          link: this.link,
          content: this.content,
          tags: this.tags
        });
      article.$save(function (response) {
        $location.path('articles');
        $scope.title = '';
        $scope.link = '';
        $scope.content = '';
        $scope.tags = '';
        $scope.find();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
        $scope.find();
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
    $scope.findTags = function () {
      var rawTags = {};
      $http.get('/article_tags').success(function (data) {
        rawTags = data;
        console.log(rawTags);
        for (var prop in rawTags) {
          $scope.tags.push(prop);
        }
      }).error(function () {
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
      }  // is newly selected
      else {
        $scope.selection.push(tag);
      }
    };
    var tags = $resource('/article_tags');
  }
]);'use strict';
angular.module('articles').controller('TagsController', [
  '$http',
  '$scope',
  '$stateParams',
  '$location',
  '$timeout',
  '$resource',
  '$q',
  'Authentication',
  'Articles',
  function ($http, $scope, $stateParams, $location, $timeout, $resource, $q, Authentication, Articles) {
    $scope.articles = [];
    $scope.tags = {};
    //MAKE THIS INTO SERVICE IF KEEP USING
    $scope.findTags = function () {
      $http.get('/article_tags').success(function (data) {
        console.log(data);
        $scope.tags = data;
      }).error(function () {
      });
    };
    $scope.getArticles = function () {
      return $http.get('/articles').success(function (data) {
        $scope.articles = data;
      }).error(function () {
        console.log('error in getArticles');
      });
    };
    $scope.updateTag = function (theTag) {
      $http.post('/article_tags', theTag).success(function (data) {
        $scope.tags = data;
      }).error(function () {
      });
    };
    $scope.deleteTag = function (theTag) {
      $http.delete('/article_tags/' + theTag).success(function (data) {
        $scope.tags = data;
      }).error(function () {
      });
    };
    $scope.showMessage = function (message) {
      $scope.message = message;
      return true;
    };
  }
]);'use strict';
angular.module('articles').filter('articlesByTag', [
  '_',
  function (_) {
    return function (articles, selectedTags) {
      var filtered = [];
      if (selectedTags.length === 0) {
        return articles;
      }
      var tags;
      var intersect;
      angular.forEach(articles, function (article) {
        tags = article.tags.map(function (tag) {
          return tag.text;
        });
        intersect = _.intersection(tags, selectedTags);
        if (intersect.length === selectedTags.length) {
          filtered.push(article);
        }
      });
      return filtered;
    };
  }
]);'use strict';
angular.module('articles').filter('searchArticle', [function () {
    return function (items, searchText) {
      var filtered = [];
      if (searchText === undefined) {
        return items;
      }
      angular.forEach(items, function (item) {
        if (item.title.indexOf(searchText) >= 0) {
          filtered.push(item);
        }
      });
      return filtered;
    };
  }]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
angular.module('articles').factory('_', [
  '$window',
  function ($window) {
    // Lodash angular service logic
    // ...
    // Public API
    return $window._;
  }
]);'use strict';
describe('Filter: articlesByTag', function () {
  // load the filter's module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  // initialize a new instance of the filter before each test
  var articlesByTagFilter;
  beforeEach(inject(function ($filter) {
    articlesByTagFilter = $filter('articlesByTag');
  }));
  it('articleByTag filter should return tags if selectedTags length is more than zero', function () {
    expect(articlesByTagFilter([{ tags: [{ 'text': 'tag-3' }] }], ['tag-3'])).toEqual([{ tags: [{ 'text': 'tag-3' }] }]);
  });
  it('articleByTag filter should return articles if selectedTags.length is 0', function () {
    expect(articlesByTagFilter([{ tags: [{ 'text': 'tag-3' }] }], [])).toEqual([{ tags: [{ 'text': 'tag-3' }] }]);
  });
});'use strict';
(function () {
  // Articles Controller Spec
  describe('ArticlesController', function () {
    // Initialize global variables
    var ArticlesController, scope, $httpBackend, $stateParams, $location;
    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return { pass: angular.equals(actual, expected) };
            }
          };
        }
      });
    });
    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();
      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      // Initialize the Articles controller.
      ArticlesController = $controller('ArticlesController', { $scope: scope });
    }));
    it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Articles) {
      // Create a sample article object
      var sampleArticlePostData = new Articles({
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ 'text': 'tag-3' }]
        });
      // Create a sample article response
      var sampleArticleResponse = new Articles({
          _id: '525cf20451979dea2c000001',
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ 'text': 'tag-3' }]
        });
      // Fixture mock form input values
      scope.title = 'An Article about MEAN';
      scope.link = 'http://www.google.com';
      scope.content = 'MEAN rocks!';
      scope.tags = [{ 'text': 'tag-3' }];
      // Set POST response
      $httpBackend.expectPOST('articles', sampleArticlePostData).respond(sampleArticleResponse);
      // Set GET response for scope.find()
      var sampleArticles = [sampleArticleResponse];
      $httpBackend.expectGET('articles').respond(sampleArticles);
      // Run controller functionality
      scope.create();
      $httpBackend.flush();
      // Test form inputs are reset
      expect(scope.title).toEqual('');
      expect(scope.link).toEqual('');
      expect(scope.content).toEqual('');
      expect(scope.tags).toEqual('');
      // Test URL redirection after the article was created
      expect($location.path()).toBe('/articles');
    }));
    it('$scope.remove() should send a DELETE request with a valid articleId and remove the article from the scope', inject(function (Articles) {
      // Create new article object
      var sampleArticle = new Articles({ _id: '525a8422f6d0f87f0e407a33' });
      // Create new articles array and include the article
      scope.articles = [sampleArticle];
      // Set expected DELETE response
      $httpBackend.expectDELETE(/articles\/([0-9a-fA-F]{24})$/).respond(204);
      // Set GET response for scope.find()
      var sampleArticles = 0;
      $httpBackend.expectGET('articles').respond(sampleArticles);
      // Run controller functionality
      scope.remove(sampleArticle);
      $httpBackend.flush();
      // Test array after successful delete
      expect(scope.articles.length).toBe(0);
    }));
    it('$scope.update() should update a valid article', inject(function (Articles) {
      // Define a sample article put data
      var sampleArticlePutData = new Articles({
          _id: '525cf20451979dea2c000001',
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN Rocks!',
          tags: [{ 'text': 'tag-3' }]
        });
      // Mock article in scope
      scope.article = sampleArticlePutData;
      // Set PUT response
      $httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/).respond();
      // Run controller functionality
      scope.update();
      $httpBackend.flush();
      // Test URL location to new object
      expect($location.path()).toBe('/articles');
    }));
    it('$scope.find() should create an array with at least one article object fetched from XHR', inject(function (Articles) {
      // Create sample article using the Articles service
      var sampleArticle = new Articles({
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ 'text': 'tag-3' }]
        });
      // Create a sample articles array that includes the new article
      var sampleArticles = [sampleArticle];
      // Set GET response
      $httpBackend.expectGET('articles').respond(sampleArticles);
      // Run controller functionality
      scope.find();
      $httpBackend.flush();
      // Test scope value
      expect(scope.articles).toEqualData(sampleArticles);
    }));
    it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function (Articles) {
      // Define a sample article object
      var sampleArticle = new Articles({
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ 'text': 'tag-3' }]
        });
      // Set the URL parameter
      $stateParams.articleId = '525a8422f6d0f87f0e407a33';
      // Set GET response
      $httpBackend.expectGET(/articles\/([0-9a-fA-F]{24})$/).respond(sampleArticle);
      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();
      // Test scope value
      expect(scope.article).toEqualData(sampleArticle);
    }));
    it('scope.findTags() should load all tags', function () {
      var sampleTags = { 'tag-1': {} };
      $httpBackend.expectGET('/article_tags').respond(sampleTags);
      scope.findTags();
      $httpBackend.flush();
      expect(scope.tags).toEqual(['tag-1']);
    });
    it('$scope.toggleSelection(tag) splices tag if currently selected', function () {
      scope.selection = ['tag'];
      scope.toggleSelection('tag');
      expect(scope.selection).toEqual([]);
    });
    it('scope.toggleSelection(tag) pushes tag if newly selected', function () {
      scope.selection = [];
      scope.toggleSelection('tag');
      expect(scope.selection).toEqual(['tag']);
    });
  });
}());'use strict';
describe('lodash', function () {
  var _, window;
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  beforeEach(inject(function ($injector, _$window_) {
    _ = $injector.get('_');
    window = _$window_;
  }));
  it('lodash service should get lodash window object', function () {
    expect(_).toEqual(window._);
  });
});'use strict';
describe('Filter: searchArticle', function () {
  // load the filter's module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  // initialize a new instance of the filter before each test
  var searchArticleFilter;
  beforeEach(inject(function ($filter) {
    searchArticleFilter = $filter('searchArticle');
  }));
  it('searchArticle filter should return items if searchText is undefined', function () {
    expect(searchArticleFilter([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ 'text': 'tag-3' }]
      }], undefined)).toEqual([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ 'text': 'tag-3' }]
      }]);
  });
  it('searchArticle filter should return articles that contain searchText', function () {
    expect(searchArticleFilter([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ 'text': 'tag-3' }]
      }], 'MEA')).toEqual([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ 'text': 'tag-3' }]
      }]);
  });
  it('searchArticle filter should not return articles that do not contain searchText', function () {
    expect(searchArticleFilter([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ 'text': 'tag-3' }]
      }], 'test')).toEqual([]);
  });  /*it('should output 7 if 7 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(1325552000);
    expect(result).toEqual(7);
  });

  it('should output 6 if 6 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(1239151500);
    expect(result).toEqual(6);
  });

  it('should output 5 if 5 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(1152751500);
    expect(result).toEqual(5);
  });

  it('should output 4 if 4 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(1066351500);
    expect(result).toEqual(4);
  });

  it('should output 3 if 3 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(979951500);
    expect(result).toEqual(3);
  });

  it('should output 2 if 2 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(893551500);
    expect(result).toEqual(2);
  });

  it('should output 1 if 1 day away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(807151500);
    expect(result).toEqual(1);
  });

  it('should output 0 if 0 days away', function() {
    spyOn(Date, 'now').andReturn(1411951480);
    var result = daysleftFilter(720751500);
    expect(result).toEqual(0);
  });*/
});'use strict';
(function () {
  // Tags Controller Spec
  describe('Tags Controller Tests', function () {
    // Initialize global variables
    var TagsController, scope, $httpBackend, $stateParams, $location;
    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return { pass: angular.equals(actual, expected) };
            }
          };
        }
      });
    });
    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();
      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      // Initialize the Tags controller.
      TagsController = $controller('TagsController', { $scope: scope });
    }));
    it('$scope.findTags() should find tags', function () {
      var sampleTag = { 'tag-1': {} };
      var sampleTags = [sampleTag];
      $httpBackend.expectGET('/article_tags').respond(sampleTags);
      scope.findTags();
      $httpBackend.flush();
      expect(scope.tags).toEqualData(sampleTags);
    });
    it('$scope.getArticles() should get articles', function () {
      var articles = [];
      var sampleArticle = {
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ 'text': 'tag-3' }]
        };
      var sampleArticles = [sampleArticle];
      $httpBackend.expectGET('/articles').respond(sampleArticles);
      scope.getArticles();
      $httpBackend.flush();
      expect(scope.articles).toEqualData(sampleArticles);
    });
    it('$scope.updateTag(theTag) should update tag', function () {
      var sampleTagDeleteData = {
          'tag-1': {},
          'tag-2': {},
          'tag-3': {}
        };
      $httpBackend.expectPOST('/article_tags', 'tag-3').respond(sampleTagDeleteData);
      scope.updateTag('tag-3');
      $httpBackend.flush();
      expect(scope.tags).toEqualData({
        'tag-1': {},
        'tag-2': {},
        'tag-3': {}
      });
    });
    it('$scope.deleteTag(tag) should delete tag', function () {
      var sampleTagDeleteData = {
          'tag-1': {},
          'tag-2': {}
        };
      $httpBackend.expectDELETE('/article_tags/tag-3').respond(sampleTagDeleteData);
      scope.deleteTag('tag-3');
      $httpBackend.flush();
      expect(scope.tags).toEqualData({
        'tag-1': {},
        'tag-2': {}
      });
    });
    it('$scope.showMessage(message) should set $scope.message to mesasge and return true', function () {
      scope.showMessage('test');
      expect(scope.message).toEqual('test');
      expect(scope.showMessage('test')).toBe(true);
    });
  });
}());'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).state('providers', {
      url: '/providers',
      templateUrl: 'modules/core/views/providers.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
(function () {
  describe('HeaderController', function () {
    //Initialize global variables
    var scope, HeaderController;
    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      HeaderController = $controller('HeaderController', { $scope: scope });
    }));
    it('should expose the authentication service', function () {
      expect(scope.authentication).toBeTruthy();
    });
  });
}());'use strict';
(function () {
  describe('HomeController', function () {
    //Initialize global variables
    var scope, HomeController;
    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      HomeController = $controller('HomeController', { $scope: scope });
    }));
    it('should expose the authentication service', function () {
      expect(scope.authentication).toBeTruthy();
    });
  });
}());'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the providers page
        $location.path('/articles');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the providers page
        $location.path('/articles');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);'use strict';
(function () {
  // Authentication controller Spec
  describe('AuthenticationController', function () {
    // Initialize global variables
    var AuthenticationController, scope, $httpBackend, $stateParams, $location;
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return { pass: angular.equals(actual, expected) };
            }
          };
        }
      });
    });
    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));
    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      // Set a new global scope
      scope = $rootScope.$new();
      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      // Initialize the Authentication controller
      AuthenticationController = $controller('AuthenticationController', { $scope: scope });
    }));
    it('$scope.signin() should login with a correct user and password', function () {
      // Test expected GET request
      $httpBackend.when('POST', '/auth/signin').respond(200, 'Fred');
      scope.signin();
      $httpBackend.flush();
      // Test scope value
      expect(scope.authentication.user).toEqual('Fred');
      expect($location.url()).toEqual('/articles');
    });
    it('$scope.signin() should fail to log in with nothing', function () {
      // Test expected POST request
      $httpBackend.expectPOST('/auth/signin').respond(400, { 'message': 'Missing credentials' });
      scope.signin();
      $httpBackend.flush();
      // Test scope value
      expect(scope.error).toEqual('Missing credentials');
    });
    it('$scope.signin() should fail to log in with wrong credentials', function () {
      // Foo/Bar combo assumed to not exist
      scope.authentication.user = 'Foo';
      scope.credentials = 'Bar';
      // Test expected POST request
      $httpBackend.expectPOST('/auth/signin').respond(400, { 'message': 'Unknown user' });
      scope.signin();
      $httpBackend.flush();
      // Test scope value
      expect(scope.error).toEqual('Unknown user');
    });
    it('$scope.signup() should register with correct data', function () {
      // Test expected GET request
      scope.authentication.user = 'Fred';
      $httpBackend.when('POST', '/auth/signup').respond(200, 'Fred');
      scope.signup();
      $httpBackend.flush();
      // test scope value
      expect(scope.authentication.user).toBe('Fred');
      expect(scope.error).toEqual(undefined);
      expect($location.url()).toBe('/articles');
    });
    it('$scope.signup() should fail to register with duplicate Username', function () {
      // Test expected POST request
      $httpBackend.when('POST', '/auth/signup').respond(400, { 'message': 'Username already exists' });
      scope.signup();
      $httpBackend.flush();
      // Test scope value
      expect(scope.error).toBe('Username already exists');
    });
  });
}());'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
module.exports = function (grunt) {
  // Unified Watch Object
  var watchFiles = {
      serverViews: ['app/views/**/*.*'],
      serverJS: [
        'gruntfile.js',
        'server.js',
        'config/**/*.js',
        'app/**/*.js'
      ],
      clientViews: ['public/modules/**/views/**/*.html'],
      clientJS: [
        'public/js/*.js',
        'public/modules/**/*.js'
      ],
      clientCSS: ['public/modules/**/*.css'],
      mochaTests: ['app/tests/**/*.js']
    };
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'public/modules/articles/css/articles.css': 'public/modules/articles/css/articles.less',
          'public/modules/articles/css/tags.css': 'public/modules/articles/css/tags.less',
          'public/modules/core/css/core.css': 'public/modules/core/css/core.less',
          'public/modules/users/css/users.css': 'public/modules/users/css/users.less'
        }
      }
    },
    recess: {
      options: { compile: true },
      dist: {
        files: [{
            expand: true,
            src: 'public/modules/**/*.less',
            dest: '',
            ext: '.css'
          }]
      }
    },
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: { livereload: true }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: { livereload: true }
      },
      clientViews: {
        files: watchFiles.clientViews,
        options: { livereload: true }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: { livereload: true }
      },
      styles: {
        files: ['app/styles/{,*/}*.css'],
        tasks: [
          'newer:less',
          'autoprefixer'
        ]
      },
      recess: {
        files: [
          'public/modules/articles/css/articles.less',
          'public/modules/articles/css/tags.less',
          'public/modules/core/css/core.less',
          'public/modules/users/css/users.less'
        ],
        tasks: ['recess:dist']
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: { livereload: true }
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: { jshintrc: true }
      }
    },
    csslint: {
      options: { csslintrc: '.csslintrc' },
      all: { src: watchFiles.clientCSS }
    },
    uglify: {
      production: {
        options: { mangle: false },
        files: { 'public/dist/application.min.js': 'public/dist/application.js' }
      }
    },
    cssmin: { combine: { files: { 'public/dist/application.min.css': watchFiles.clientCSS } } },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    ngmin: {
      production: {
        files: {
          'public/dist/application.js': [
            watchFiles.clientJS,
            watchFiles.serverJS
          ]
        }
      }
    },
    concurrent: {
      default: [
        'nodemon',
        'watch'
      ],
      debug: [
        'nodemon',
        'watch',
        'node-inspector'
      ],
      options: { logConcurrentOutput: true }
    },
    env: { test: { NODE_ENV: 'test' } },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    karma: { unit: { configFile: 'karma.conf.js' } }
  });
  // Load NPM tasks 
  require('load-grunt-tasks')(grunt);
  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);
  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function () {
    var init = require('./config/init')();
    var config = require('./config/config');
    grunt.config.set('applicationJavaScriptFiles', config.assets.js);  //grunt.config.set('applicationCSSFiles', config.assets.css);
  });
  // Default task(s).
  grunt.registerTask('default', ['concurrent:default']);
  // Debug task.
  grunt.registerTask('debug', ['concurrent:debug']);
  // Lint task(s).
  //grunt.registerTask('lint', ['jshint', 'csslint']);
  // Build task(s).
  grunt.registerTask('build', [
    'less',
    'loadConfig',
    'ngmin',
    'uglify',
    'cssmin'
  ]);
  // Test task.
  grunt.registerTask('test', [
    'env:test',
    'mochaTest',
    'karma:unit',
    'less'
  ]);
};'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(), config = require('./config/config'), mongoose = require('mongoose');
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
// Bootstrap db connection
var db = mongoose.connect(config.db, function (err) {
    if (err) {
      console.error('\x1b[31m', 'Could not connect to MongoDB!');
      console.log(err);
    }
  });
// Init the express application
var app = require('./config/express')(db);
// Bootstrap passport config
require('./config/passport')();
// Start the app by listening on <port>
app.listen(config.port);
// Expose app
exports = module.exports = app;
// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'), glob = require('glob');
/**
 * Load app configurations
 */
module.exports = _.extend(require('./env/all'), require('./env/' + process.env.NODE_ENV) || {});
/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function (globPatterns, removeRoot) {
  // For context switching
  var _this = this;
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
  // The output array
  var output = [];
  // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      glob(globPatterns, { sync: true }, function (err, files) {
        if (removeRoot) {
          files = files.map(function (file) {
            return file.replace(removeRoot, '');
          });
        }
        output = _.union(output, files);
      });
    }
  }
  return output;
};
/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function (includeTests) {
  var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');
  // To include tests
  if (includeTests) {
    output = _.union(output, this.getGlobbedFiles(this.assets.tests));
  }
  return output;
};
/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function () {
  var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
  return output;
};'use strict';
module.exports = {
  app: {
    title: 'bloc3',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'MongoDB, Express, AngularJS, Node.js'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  assets: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/lodash/dist/lodash.js'
      ]
    },
    css: ['public/modules/**/css/*.css'],
    js: [
      'public/config.js',
      'public/application.js',
      'public/modules/*/*.js',
      'public/modules/*/*[!tests]*/*.js'
    ],
    tests: [
      'public/lib/angular-mocks/angular-mocks.js',
      'public/modules/*/tests/*.js'
    ]
  }
};'use strict';
module.exports = {
  db: 'mongodb://localhost/bloc3-dev',
  app: { title: 'bloc3 - Development Environment' },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};'use strict';
var MONGOHQ_URL = 'mongodb://' + process.env.MONGOHQ_UN + ':' + process.env.MONGOHQ_PW + '@dogen.mongohq.com:10026/app31834364';
module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/bloc3',
  assets: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/lodash/dist/lodash.min.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};'use strict';
module.exports = {
  db: 'mongodb://localhost/bloc3-test',
  port: 3001,
  app: { title: 'bloc3 - Test Environment' },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};'use strict';
/**
 * Module dependencies.
 */
var express = require('express'), morgan = require('morgan'), bodyParser = require('body-parser'), session = require('express-session'), compress = require('compression'), methodOverride = require('method-override'), cookieParser = require('cookie-parser'), helmet = require('helmet'), passport = require('passport'), mongoStore = require('connect-mongo')({ session: session }), flash = require('connect-flash'), config = require('./config'), consolidate = require('consolidate'), path = require('path');
module.exports = function (db) {
  // Initialize express app
  var app = express();
  // Globbing model files
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.jsFiles = config.getJavaScriptAssets();
  app.locals.cssFiles = config.getCSSAssets();
  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });
  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }));
  // Showing stack errors
  app.set('showStackError', true);
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);
  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './app/views');
  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }
  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  // Enable jsonp
  app.enable('jsonp callback');
  // CookieParser should be above session
  app.use(cookieParser());
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new mongoStore({
      db: db.connection.db,
      collection: config.sessionCollection
    })
  }));
  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());
  // connect flash for flash messages
  app.use(flash());
  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');
  // Setting the app router and static folder
  app.use(express.static(path.resolve('./public')));
  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err)
      return next();
    // Log it
    console.error(err.stack);
    // Error page
    res.status(500).render('500', { error: err.stack });
  });
  // Assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not Found'
    });
  });
  return app;
};'use strict';
/**
 * Module dependencies.
 */
var glob = require('glob');
/**
 * Module init function.
 */
module.exports = function () {
  /**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */
  glob('./config/env/' + process.env.NODE_ENV + '.js', { sync: true }, function (err, environmentFiles) {
    console.log();
    if (!environmentFiles.length) {
      if (process.env.NODE_ENV) {
        console.error('\x1b[31m', 'No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
      } else {
        console.error('\x1b[31m', 'NODE_ENV is not defined! Using default development environment');
      }
      process.env.NODE_ENV = 'development';
    } else {
      console.log('\x1b[7m', 'Application loaded using the "' + process.env.NODE_ENV + '" environment configuration');
    }
    console.log('\x1b[0m');
  });
  /**
	 * Add our server node extensions
	 */
  require.extensions['.server.controller.js'] = require.extensions['.js'];
  require.extensions['.server.model.js'] = require.extensions['.js'];
  require.extensions['.server.routes.js'] = require.extensions['.js'];
};'use strict';
var passport = require('passport'), User = require('mongoose').model('User'), path = require('path'), config = require('./config');
module.exports = function () {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });
  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
    require(path.resolve(strategy))();
  });
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), url = require('url'), FacebookStrategy = require('passport-facebook').Strategy, config = require('../config'), users = require('../../app/controllers/users');
module.exports = function () {
  // Use facebook strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
    // Create the user OAuth profile
    var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'facebook',
        providerIdentifierField: 'id',
        providerData: providerData
      };
    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), url = require('url'), GithubStrategy = require('passport-github').Strategy, config = require('../config'), users = require('../../app/controllers/users');
module.exports = function () {
  // Use github strategy
  passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
    // Create the user OAuth profile
    var providerUserProfile = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'github',
        providerIdentifierField: 'id',
        providerData: providerData
      };
    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), url = require('url'), GoogleStrategy = require('passport-google-oauth').OAuth2Strategy, config = require('../config'), users = require('../../app/controllers/users');
module.exports = function () {
  // Use google strategy
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true
  }, function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
    // Create the user OAuth profile
    var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };
    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), url = require('url'), LinkedInStrategy = require('passport-linkedin').Strategy, config = require('../config'), users = require('../../app/controllers/users');
module.exports = function () {
  // Use linkedin strategy
  passport.use(new LinkedInStrategy({
    consumerKey: config.linkedin.clientID,
    consumerSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    passReqToCallback: true,
    profileFields: [
      'id',
      'first-name',
      'last-name',
      'email-address'
    ]
  }, function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;
    // Create the user OAuth profile
    var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'linkedin',
        providerIdentifierField: 'id',
        providerData: providerData
      };
    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy, User = require('mongoose').model('User');
module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }));
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), User = require('mongoose').model('User'), url = require('url'), SpotifyStrategy = require('passport-spotify').Strategy, config = require('../config'), users = require('../../app/controllers/users');
module.exports = function () {
  var appKey = '4d0dce5db26c45048472d4770a5866f3';
  var appSecret = 'ea3072d048bf4addb2b4f04763e2dd41';
  passport.use(new SpotifyStrategy({
    clientID: appKey,
    clientSecret: appSecret,
    callbackURL: 'http://localhost:3000/auth/spotify/callback'
  }, function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }));
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport'), url = require('url'), TwitterStrategy = require('passport-twitter').Strategy, config = require('../config'), users = require('../../app/controllers/users');
module.exports = function () {
  // Use twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  }, function (req, token, tokenSecret, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.token = token;
    providerData.tokenSecret = tokenSecret;
    // Create the user OAuth profile
    var providerUserProfile = {
        displayName: profile.displayName,
        username: profile.username,
        provider: 'twitter',
        providerIdentifierField: 'id_str',
        providerData: providerData
      };
    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), errorHandler = require('./errors'), Article = mongoose.model('Article'), _ = require('lodash');
/**
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;
  article.save(function (err) {
    if (err) {
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    } else {
      res.jsonp(article);
    }
  });
};
/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.jsonp(req.article);
};
/**
 * Update a article
 */
exports.update = function (req, res) {
  var article = req.article;
  article = _.extend(article, req.body);
  article.save(function (err) {
    // if (err) {
    //   return res.status(400).send({
    //     message: errorHandler.getErrorMessage(err)
    //   });
    // } else {
    res.jsonp(article);  // }
  });
};
/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;
  article.remove(function (err) {
    if (err) {
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    } else {
      res.jsonp(article);
    }
  });
};
/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.find({ user: req.user.id }).sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    } else {
      res.jsonp(articles);
    }
  });
};
/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {
  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err)
      return next(err);
    if (!article)
      return next(new Error('Failed to load article ' + id));
    req.article = article;
    next();
  });
};
/**
 * Article authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.article.user.id !== req.user.id) {
    return res.status(403).send({ message: 'User is not authorized' });
  }
  next();
};
exports.tags = function (req, res) {
  var cleanTags = {};
  Article.aggregate([
    { $match: { 'user': new mongoose.Types.ObjectId(req.user.id) } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags.text' } },
    { $sort: { _id: 1 } }
  ]).exec(function (err, tags) {
    if (err) {
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    } else {
      for (var i = 0; i < tags.length; i++) {
        cleanTags[tags[i]._id] = { original: tags[i]._id };
      }
      res.jsonp(cleanTags);
    }
  });
};
exports.updateTags = function (req, res) {
  var newTag = req.body.newTag;
  var oldTag = req.body.oldTag;
  console.log(req.body);
  Article.update({ 'tags.text': oldTag }, { $set: { 'tags.$.text': newTag } }, { multi: true }, function (err, results) {
    exports.tags(req, res);
  });
};
exports.deleteTags = function (req, res) {
  Article.update({ 'tags.text': req.params.tag }, { $pull: { 'tags': { text: req.params.tag } } }, { multi: true }, function (err, results) {
    exports.tags(req, res);
  });
};'use strict';
/**
 * Module dependencies.
 */
exports.index = function (req, res) {
  res.render('index', { user: req.user || null });
};'use strict';
/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function (err) {
  var output;
  try {
    var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exist';
  } catch (ex) {
    output = 'Unique field already exist';
  }
  return output;
};
/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
  var message = '';
  if (err.code) {
    switch (err.code) {
    case 11000:
    case 11001:
      message = getUniqueErrorMessage(err);
      break;
    default:
      message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
        message = err.errors[errName].message;
    }
  }
  return message;
};'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash');
/**
 * Extend user's controller
 */
module.exports = _.extend(require('./users/users.authentication'), require('./users/users.authorization'), require('./users/users.password'), require('./users/users.profile'));'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'), errorHandler = require('../errors'), mongoose = require('mongoose'), passport = require('passport'), User = mongoose.model('User');
/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  // Init Variables
  var user = new User(req.body);
  var message = null;
  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;
  // Then save the user 
  user.save(function (err) {
    if (err) {
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.jsonp(user);
        }
      });
    }
  });
};
/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.jsonp(user);
        }
      });
    }
  })(req, res, next);
};
/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};
/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err || !user) {
        return res.redirect('/#!/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/#!/signin');
        }
        return res.redirect('/#!/articles' || '/providers');
      });
    })(req, res, next);
  };
};
/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;
    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];
    // Define a search query to find existing user with current provider profile
    var searchQuery = {
        $or: [
          mainProviderSearchQuery,
          additionalProviderSearchQuery
        ]
      };
    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || (providerUserProfile.email ? providerUserProfile.email.split('@')[0] : '');
          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });
            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;
    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData)
        user.additionalProvidersData = {};
      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;
      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
      // And save the user
      user.save(function (err) {
        return done(err, user, '/#!/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};
/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.param('provider');
  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];
      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }
    user.save(function (err) {
      if (err) {
        return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  }
};'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'), mongoose = require('mongoose'), User = mongoose.model('User');
/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({ _id: id }).exec(function (err, user) {
    if (err)
      return next(err);
    if (!user)
      return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};
/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ message: 'User is not logged in' });
  }
  next();
};
/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (roles) {
  var _this = this;
  return function (req, res, next) {
    _this.requiresLogin(req, res, function () {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(403).send({ message: 'User is not authorized' });
      }
    });
  };
};'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'), errorHandler = require('../errors'), mongoose = require('mongoose'), passport = require('passport'), User = mongoose.model('User'), config = require('../../../config/config'), nodemailer = require('nodemailer'), crypto = require('crypto'), async = require('async'), crypto = require('crypto');
/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      if (req.body.username) {
        User.findOne({ username: req.body.username }, '-salt -password', function (err, user) {
          if (!user) {
            return res.status(400).send({ message: 'No account with that username has been found' });
          } else if (user.provider !== 'local') {
            return res.status(400).send({ message: 'It seems like you signed up using your ' + user.provider + ' account' });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            // 1 hour
            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({ message: 'Username field must not be blank' });
      }
    },
    function (token, user, done) {
      res.render('templates/reset-password-email', {
        name: user.displayName,
        appName: config.app.title,
        url: 'http://' + req.headers.host + '/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    function (emailHTML, user, done) {
      var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
          to: user.email,
          from: config.mailer.from,
          subject: 'Password Reset',
          html: emailHTML
        };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({ message: 'An email has been sent to ' + user.email + ' with further instructions.' });
        }
        done(err);
      });
    }
  ], function (err) {
    if (err)
      return next(err);
  });
};
/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  }, function (err, user) {
    if (!user) {
      return res.redirect('/#!/password/reset/invalid');
    }
    res.redirect('/#!/password/reset/' + req.params.token);
  });
};
/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;
  async.waterfall([
    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save(function (err) {
              if (err) {
                return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Return authenticated user 
                    res.jsonp(user);
                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({ message: 'Passwords do not match' });
          }
        } else {
          return res.status(400).send({ message: 'Password reset token is invalid or has expired.' });
        }
      });
    },
    function (user, done) {
      res.render('templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    function (emailHTML, user, done) {
      var smtpTransport = nodemailer.createTransport(config.mailer.options);
      var mailOptions = {
          to: user.email,
          from: config.mailer.from,
          subject: 'Your password has been changed',
          html: emailHTML
        };
      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err)
      return next(err);
  });
};
/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;
  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;
              user.save(function (err) {
                if (err) {
                  return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({ message: 'Password changed successfully' });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({ message: 'Passwords do not match' });
            }
          } else {
            res.status(400).send({ message: 'Current password is incorrect' });
          }
        } else {
          res.status(400).send({ message: 'User is not found' });
        }
      });
    } else {
      res.status(400).send({ message: 'Please provide a new password' });
    }
  } else {
    res.status(400).send({ message: 'User is not signed in' });
  }
};'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'), errorHandler = require('../errors'), mongoose = require('mongoose'), passport = require('passport'), User = mongoose.model('User');
/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;
  var message = null;
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;
    user.save(function (err) {
      if (err) {
        return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({ message: 'User is not signed in' });
  }
};
/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema;
/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    created: {
      type: Date,
      default: Date.now
    },
    title: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
    },
    link: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String,
      default: '',
      trim: true
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    tags: { type: Schema.Types.Mixed }
  });
mongoose.model('Article', ArticleSchema);'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), Schema = mongoose.Schema, crypto = require('crypto');
/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return this.provider !== 'local' && !this.updated || property.length;
};
/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
  return this.provider !== 'local' || password && password.length > 6;
};
/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
      type: String,
      trim: true,
      default: '',
      validate: [
        validateLocalStrategyProperty,
        'Please fill in your first name'
      ]
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
      validate: [
        validateLocalStrategyProperty,
        'Please fill in your last name'
      ]
    },
    displayName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: '',
      validate: [
        validateLocalStrategyProperty,
        'Please fill in your email'
      ],
      match: [
        /.+\@.+\..+/,
        'Please fill a valid email address'
      ]
    },
    username: {
      type: String,
      unique: 'testing error message',
      required: 'Please fill in a username',
      trim: true
    },
    password: {
      type: String,
      default: '',
      validate: [
        validateLocalStrategyPassword,
        'Password should be longer'
      ]
    },
    salt: { type: String },
    provider: {
      type: String,
      required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
      type: [{
          type: String,
          enum: [
            'user',
            'admin'
          ]
        }],
      default: ['user']
    },
    updated: { type: Date },
    created: {
      type: Date,
      default: Date.now
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    spotifyId: { type: String }
  });
/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.password.length > 6) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});
/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};
/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};
/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');
  _this.findOne({ username: possibleUsername }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};
mongoose.model('User', UserSchema);'use strict';
/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'), articles = require('../../app/controllers/articles');
module.exports = function (app) {
  // Article Routes
  app.route('/articles').get(articles.list).post(users.requiresLogin, articles.create);
  app.route('/articles/:articleId').get(articles.read).put(users.requiresLogin, articles.hasAuthorization, articles.update).delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
  app.route('/article_tags').get(articles.tags).post(articles.updateTags);
  app.route('/article_tags/:tag').delete(articles.deleteTags);
  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};'use strict';
module.exports = function (app) {
  // Root routing
  var core = require('../../app/controllers/core');
  app.route('/').get(core.index);
};'use strict';
/**
 * Module dependencies.
 */
var passport = require('passport');
module.exports = function (app) {
  // User Routes
  var users = require('../../app/controllers/users');
  // Setting up the users profile api
  app.route('/users/me').get(users.me);
  app.route('/users').put(users.update);
  app.route('/users/accounts').delete(users.removeOAuthProvider);
  // Setting up the users password api
  app.route('/users/password').post(users.changePassword);
  app.route('/auth/forgot').post(users.forgot);
  app.route('/auth/reset/:token').get(users.validateResetToken);
  app.route('/auth/reset/:token').post(users.reset);
  // Setting up the users authentication api
  app.route('/auth/signup').post(users.signup);
  app.route('/auth/signin').post(users.signin);
  app.route('/auth/signout').get(users.signout);
  // Seeting the spotify oauth routes
  app.route('/auth/spotify').get(passport.authenticate('spotify'));
  app.route('/auth/spotify/callback').get(users.oauthCallback('spotify'));
  // Setting the facebook oauth routes
  app.route('/auth/facebook').get(passport.authenticate('facebook', { scope: ['email'] }));
  app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));
  // Setting the twitter oauth routes
  app.route('/auth/twitter').get(passport.authenticate('twitter'));
  app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));
  // Setting the google oauth routes
  app.route('/auth/google').get(passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/auth/google/callback').get(users.oauthCallback('google'));
  // Setting the linkedin oauth routes
  app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
  app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));
  // Setting the github oauth routes
  app.route('/auth/github').get(passport.authenticate('github'));
  app.route('/auth/github/callback').get(users.oauthCallback('github'));
  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};'use strict';
/**
 * Module dependencies.
 */
var should = require('should'), mongoose = require('mongoose'), User = mongoose.model('User'), Article = mongoose.model('Article');
/**
 * Globals
 */
var user, article;
/**
 * Unit tests
 */
describe('Article Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });
    user.save(function () {
      article = new Article({
        title: 'Article Title',
        content: 'Article Content',
        user: user
      });
      done();
    });
  });
  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return article.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without title', function (done) {
      article.title = '';
      return article.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });
  afterEach(function (done) {
    Article.remove().exec();
    User.remove().exec();
    done();
  });
});'use strict';
/**
 * Module dependencies.
 */
var should = require('should'), mongoose = require('mongoose'), User = mongoose.model('User');
/**
 * Globals
 */
var user, user2;
/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
  before(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    });
    user2 = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password',
      provider: 'local'
    });
    done();
  });
  describe('Method Save', function () {
    it('should begin with no users', function (done) {
      User.find({}, function (err, users) {
        users.should.have.length(0);
        done();
      });
    });
    it('should be able to save without problems', function (done) {
      user.save(done);
    });
    it('should fail to save an existing user again', function (done) {
      user.save();
      return user2.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without first name', function (done) {
      user.firstName = '';
      return user.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });
  after(function (done) {
    User.remove().exec();
    done();
  });
});