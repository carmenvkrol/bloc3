'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'bloc3';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngTagsInput'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'bloc3';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngTagsInput'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();
'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);
'use strict';
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
]);
'use strict';
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
]);
'use strict';
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
]);
'use strict';
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
]);
'use strict';
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
  }]);
'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
'use strict';
angular.module('articles').factory('_', [
  '$window',
  function ($window) {
    // Lodash angular service logic
    // ...
    // Public API
    return $window._;
  }
]);
'use strict';
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
});
'use strict';
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
}());
'use strict';
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
});
'use strict';
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
});
'use strict';
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
}());
'use strict';
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
]);
'use strict';
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
]);
'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);
'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';
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
  }]);
'use strict';
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
}());
'use strict';
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
}());
'use strict';
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
]);
'use strict';
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
]);
'use strict';
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
]);
'use strict';
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
]);
'use strict';
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
]);
'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);
'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);
'use strict';
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
}());
'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies), angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]), angular.element(document).ready(function () {
  '#_=_' === window.location.hash && (window.location.hash = '#!'), angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
var ApplicationConfiguration = function () {
    var applicationModuleName = 'bloc3', applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngTagsInput'
      ], registerModule = function (moduleName, dependencies) {
        angular.module(moduleName, dependencies || []), angular.module(applicationModuleName).requires.push(moduleName);
      };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();
ApplicationConfiguration.registerModule('articles'), angular.module('articles').run([
  'Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?'), Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles'), Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]), angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
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
]), angular.module('articles').controller('ArticlesController', [
  '$http',
  '$scope',
  '$stateParams',
  '$location',
  '$timeout',
  '$resource',
  'Authentication',
  'Articles',
  function ($http, $scope, $stateParams, $location, $timeout, $resource, Authentication, Articles) {
    $scope.authentication = Authentication, $scope.create = function () {
      var article = new Articles({
          title: this.title,
          link: this.link,
          content: this.content,
          tags: this.tags
        });
      article.$save(function () {
        $location.path('articles'), $scope.title = '', $scope.link = '', $scope.content = '', $scope.tags = '', $scope.find();
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }, $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles)
          $scope.articles[i] === article && $scope.articles.splice(i, 1);
        $scope.find();
      } else
        $scope.article.$remove(function () {
          $location.path('articles');
        });
    }, $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }, $scope.find = function () {
      $scope.articles = Articles.query();
    }, $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    }, $scope.findTags = function () {
      var rawTags = {};
      $http.get('/article_tags').success(function (data) {
        rawTags = data, console.log(rawTags);
        for (var prop in rawTags)
          $scope.tags.push(prop);
      }).error(function () {
      }), $scope.tags = [];
    }, $scope.selection = [], $scope.toggleSelection = function (tag) {
      var idx = $scope.selection.indexOf(tag);
      idx > -1 ? $scope.selection.splice(idx, 1) : $scope.selection.push(tag);
    };
    $resource('/article_tags');
  }
]), angular.module('articles').controller('TagsController', [
  '$http',
  '$scope',
  '$stateParams',
  '$location',
  '$timeout',
  '$resource',
  '$q',
  'Authentication',
  'Articles',
  function ($http, $scope) {
    $scope.articles = [], $scope.tags = {}, $scope.findTags = function () {
      $http.get('/article_tags').success(function (data) {
        console.log(data), $scope.tags = data;
      }).error(function () {
      });
    }, $scope.getArticles = function () {
      return $http.get('/articles').success(function (data) {
        $scope.articles = data;
      }).error(function () {
        console.log('error in getArticles');
      });
    }, $scope.updateTag = function (theTag) {
      $http.post('/article_tags', theTag).success(function (data) {
        $scope.tags = data;
      }).error(function () {
      });
    }, $scope.deleteTag = function (theTag) {
      $http.delete('/article_tags/' + theTag).success(function (data) {
        $scope.tags = data;
      }).error(function () {
      });
    }, $scope.showMessage = function (message) {
      return $scope.message = message, !0;
    };
  }
]), angular.module('articles').filter('articlesByTag', [
  '_',
  function (_) {
    return function (articles, selectedTags) {
      var filtered = [];
      if (0 === selectedTags.length)
        return articles;
      var tags, intersect;
      return angular.forEach(articles, function (article) {
        tags = article.tags.map(function (tag) {
          return tag.text;
        }), intersect = _.intersection(tags, selectedTags), intersect.length === selectedTags.length && filtered.push(article);
      }), filtered;
    };
  }
]), angular.module('articles').filter('searchArticle', [function () {
    return function (items, searchText) {
      var filtered = [];
      return void 0 === searchText ? items : (angular.forEach(items, function (item) {
        item.title.indexOf(searchText) >= 0 && filtered.push(item);
      }), filtered);
    };
  }]), angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]), angular.module('articles').factory('_', [
  '$window',
  function ($window) {
    return $window._;
  }
]), describe('Filter: articlesByTag', function () {
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  var articlesByTagFilter;
  beforeEach(inject(function ($filter) {
    articlesByTagFilter = $filter('articlesByTag');
  })), it('articleByTag filter should return tags if selectedTags length is more than zero', function () {
    expect(articlesByTagFilter([{ tags: [{ text: 'tag-3' }] }], ['tag-3'])).toEqual([{ tags: [{ text: 'tag-3' }] }]);
  }), it('articleByTag filter should return articles if selectedTags.length is 0', function () {
    expect(articlesByTagFilter([{ tags: [{ text: 'tag-3' }] }], [])).toEqual([{ tags: [{ text: 'tag-3' }] }]);
  });
}), function () {
  describe('ArticlesController', function () {
    var ArticlesController, scope, $httpBackend, $stateParams, $location;
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function () {
          return {
            compare: function (actual, expected) {
              return { pass: angular.equals(actual, expected) };
            }
          };
        }
      });
    }), beforeEach(module(ApplicationConfiguration.applicationModuleName)), beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      scope = $rootScope.$new(), $stateParams = _$stateParams_, $httpBackend = _$httpBackend_, $location = _$location_, ArticlesController = $controller('ArticlesController', { $scope: scope });
    })), it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Articles) {
      var sampleArticlePostData = new Articles({
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ text: 'tag-3' }]
        }), sampleArticleResponse = new Articles({
          _id: '525cf20451979dea2c000001',
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ text: 'tag-3' }]
        });
      scope.title = 'An Article about MEAN', scope.link = 'http://www.google.com', scope.content = 'MEAN rocks!', scope.tags = [{ text: 'tag-3' }], $httpBackend.expectPOST('articles', sampleArticlePostData).respond(sampleArticleResponse);
      var sampleArticles = [sampleArticleResponse];
      $httpBackend.expectGET('articles').respond(sampleArticles), scope.create(), $httpBackend.flush(), expect(scope.title).toEqual(''), expect(scope.link).toEqual(''), expect(scope.content).toEqual(''), expect(scope.tags).toEqual(''), expect($location.path()).toBe('/articles');
    })), it('$scope.remove() should send a DELETE request with a valid articleId and remove the article from the scope', inject(function (Articles) {
      var sampleArticle = new Articles({ _id: '525a8422f6d0f87f0e407a33' });
      scope.articles = [sampleArticle], $httpBackend.expectDELETE(/articles\/([0-9a-fA-F]{24})$/).respond(204);
      var sampleArticles = 0;
      $httpBackend.expectGET('articles').respond(sampleArticles), scope.remove(sampleArticle), $httpBackend.flush(), expect(scope.articles.length).toBe(0);
    })), it('$scope.update() should update a valid article', inject(function (Articles) {
      var sampleArticlePutData = new Articles({
          _id: '525cf20451979dea2c000001',
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN Rocks!',
          tags: [{ text: 'tag-3' }]
        });
      scope.article = sampleArticlePutData, $httpBackend.expectPUT(/articles\/([0-9a-fA-F]{24})$/).respond(), scope.update(), $httpBackend.flush(), expect($location.path()).toBe('/articles');
    })), it('$scope.find() should create an array with at least one article object fetched from XHR', inject(function (Articles) {
      var sampleArticle = new Articles({
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ text: 'tag-3' }]
        }), sampleArticles = [sampleArticle];
      $httpBackend.expectGET('articles').respond(sampleArticles), scope.find(), $httpBackend.flush(), expect(scope.articles).toEqualData(sampleArticles);
    })), it('$scope.findOne() should create an array with one article object fetched from XHR using a articleId URL parameter', inject(function (Articles) {
      var sampleArticle = new Articles({
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ text: 'tag-3' }]
        });
      $stateParams.articleId = '525a8422f6d0f87f0e407a33', $httpBackend.expectGET(/articles\/([0-9a-fA-F]{24})$/).respond(sampleArticle), scope.findOne(), $httpBackend.flush(), expect(scope.article).toEqualData(sampleArticle);
    })), it('scope.findTags() should load all tags', function () {
      var sampleTags = { 'tag-1': {} };
      $httpBackend.expectGET('/article_tags').respond(sampleTags), scope.findTags(), $httpBackend.flush(), expect(scope.tags).toEqual(['tag-1']);
    }), it('$scope.toggleSelection(tag) splices tag if currently selected', function () {
      scope.selection = ['tag'], scope.toggleSelection('tag'), expect(scope.selection).toEqual([]);
    }), it('scope.toggleSelection(tag) pushes tag if newly selected', function () {
      scope.selection = [], scope.toggleSelection('tag'), expect(scope.selection).toEqual(['tag']);
    });
  });
}(), describe('lodash', function () {
  var _, window;
  beforeEach(module(ApplicationConfiguration.applicationModuleName)), beforeEach(inject(function ($injector, _$window_) {
    _ = $injector.get('_'), window = _$window_;
  })), it('lodash service should get lodash window object', function () {
    expect(_).toEqual(window._);
  });
}), describe('Filter: searchArticle', function () {
  beforeEach(module(ApplicationConfiguration.applicationModuleName));
  var searchArticleFilter;
  beforeEach(inject(function ($filter) {
    searchArticleFilter = $filter('searchArticle');
  })), it('searchArticle filter should return items if searchText is undefined', function () {
    expect(searchArticleFilter([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ text: 'tag-3' }]
      }], void 0)).toEqual([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ text: 'tag-3' }]
      }]);
  }), it('searchArticle filter should return articles that contain searchText', function () {
    expect(searchArticleFilter([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ text: 'tag-3' }]
      }], 'MEA')).toEqual([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ text: 'tag-3' }]
      }]);
  }), it('searchArticle filter should not return articles that do not contain searchText', function () {
    expect(searchArticleFilter([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{ text: 'tag-3' }]
      }], 'test')).toEqual([]);
  });
}), function () {
  describe('Tags Controller Tests', function () {
    var TagsController, scope, $httpBackend, $stateParams, $location;
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function () {
          return {
            compare: function (actual, expected) {
              return { pass: angular.equals(actual, expected) };
            }
          };
        }
      });
    }), beforeEach(module(ApplicationConfiguration.applicationModuleName)), beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      scope = $rootScope.$new(), $stateParams = _$stateParams_, $httpBackend = _$httpBackend_, $location = _$location_, TagsController = $controller('TagsController', { $scope: scope });
    })), it('$scope.findTags() should find tags', function () {
      var sampleTag = { 'tag-1': {} }, sampleTags = [sampleTag];
      $httpBackend.expectGET('/article_tags').respond(sampleTags), scope.findTags(), $httpBackend.flush(), expect(scope.tags).toEqualData(sampleTags);
    }), it('$scope.getArticles() should get articles', function () {
      var sampleArticle = {
          title: 'An Article about MEAN',
          link: 'http://www.google.com',
          content: 'MEAN rocks!',
          tags: [{ text: 'tag-3' }]
        }, sampleArticles = [sampleArticle];
      $httpBackend.expectGET('/articles').respond(sampleArticles), scope.getArticles(), $httpBackend.flush(), expect(scope.articles).toEqualData(sampleArticles);
    }), it('$scope.updateTag(theTag) should update tag', function () {
      var sampleTagDeleteData = {
          'tag-1': {},
          'tag-2': {},
          'tag-3': {}
        };
      $httpBackend.expectPOST('/article_tags', 'tag-3').respond(sampleTagDeleteData), scope.updateTag('tag-3'), $httpBackend.flush(), expect(scope.tags).toEqualData({
        'tag-1': {},
        'tag-2': {},
        'tag-3': {}
      });
    }), it('$scope.deleteTag(tag) should delete tag', function () {
      var sampleTagDeleteData = {
          'tag-1': {},
          'tag-2': {}
        };
      $httpBackend.expectDELETE('/article_tags/tag-3').respond(sampleTagDeleteData), scope.deleteTag('tag-3'), $httpBackend.flush(), expect(scope.tags).toEqualData({
        'tag-1': {},
        'tag-2': {}
      });
    }), it('$scope.showMessage(message) should set $scope.message to mesasge and return true', function () {
      scope.showMessage('test'), expect(scope.message).toEqual('test'), expect(scope.showMessage('test')).toBe(!0);
    });
  });
}(), angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/'), $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).state('providers', {
      url: '/providers',
      templateUrl: 'modules/core/views/providers.client.view.html'
    });
  }
]), angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication, $scope.isCollapsed = !1, $scope.menu = Menus.getMenu('topbar'), $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    }, $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = !1;
    });
  }
]), angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    $scope.authentication = Authentication;
  }
]), ApplicationConfiguration.registerModule('core'), angular.module('core').service('Menus', [function () {
    this.defaultRoles = ['*'], this.menus = {};
    var shouldRender = function (user) {
      if (!user)
        return this.isPublic;
      if (~this.roles.indexOf('*'))
        return !0;
      for (var userRoleIndex in user.roles)
        for (var roleIndex in this.roles)
          if (this.roles[roleIndex] === user.roles[userRoleIndex])
            return !0;
      return !1;
    };
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId])
          return !0;
        throw new Error('Menu does not exists');
      }
      throw new Error('MenuId was not provided');
    }, this.getMenu = function (menuId) {
      return this.validateMenuExistance(menuId), this.menus[menuId];
    }, this.addMenu = function (menuId, isPublic, roles) {
      return this.menus[menuId] = {
        isPublic: isPublic || !1,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      }, this.menus[menuId];
    }, this.removeMenu = function (menuId) {
      this.validateMenuExistance(menuId), delete this.menus[menuId];
    }, this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      return this.validateMenuExistance(menuId), this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: null === isPublic || 'undefined' == typeof isPublic ? this.menus[menuId].isPublic : isPublic,
        roles: null === roles || 'undefined' == typeof roles ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      }), this.menus[menuId];
    }, this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      this.validateMenuExistance(menuId);
      for (var itemIndex in this.menus[menuId].items)
        this.menus[menuId].items[itemIndex].link === rootMenuItemURL && this.menus[menuId].items[itemIndex].items.push({
          title: menuItemTitle,
          link: menuItemURL,
          uiRoute: menuItemUIRoute || '/' + menuItemURL,
          isPublic: null === isPublic || 'undefined' == typeof isPublic ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
          roles: null === roles || 'undefined' == typeof roles ? this.menus[menuId].items[itemIndex].roles : roles,
          position: position || 0,
          shouldRender: shouldRender
        });
      return this.menus[menuId];
    }, this.removeMenuItem = function (menuId, menuItemURL) {
      this.validateMenuExistance(menuId);
      for (var itemIndex in this.menus[menuId].items)
        this.menus[menuId].items[itemIndex].link === menuItemURL && this.menus[menuId].items.splice(itemIndex, 1);
      return this.menus[menuId];
    }, this.removeSubMenuItem = function (menuId, submenuItemURL) {
      this.validateMenuExistance(menuId);
      for (var itemIndex in this.menus[menuId].items)
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items)
          this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL && this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
      return this.menus[menuId];
    }, this.addMenu('topbar');
  }]), function () {
  describe('HeaderController', function () {
    var scope, HeaderController;
    beforeEach(module(ApplicationConfiguration.applicationModuleName)), beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new(), HeaderController = $controller('HeaderController', { $scope: scope });
    })), it('should expose the authentication service', function () {
      expect(scope.authentication).toBeTruthy();
    });
  });
}(), function () {
  describe('HomeController', function () {
    var scope, HomeController;
    beforeEach(module(ApplicationConfiguration.applicationModuleName)), beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new(), HomeController = $controller('HomeController', { $scope: scope });
    })), it('should expose the authentication service', function () {
      expect(scope.authentication).toBeTruthy();
    });
  });
}(), angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              Authentication.user = null, $location.path('signin');
              break;
            case 403:
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]), angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
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
]), angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication, $scope.authentication.user && $location.path('/'), $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        $scope.authentication.user = response, $location.path('/articles');
      }).error(function (response) {
        $scope.error = response.message;
      });
    }, $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        $scope.authentication.user = response, $location.path('/articles');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]), angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication, $scope.authentication.user && $location.path('/'), $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null, $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        $scope.credentials = null, $scope.success = response.message;
      }).error(function (response) {
        $scope.credentials = null, $scope.error = response.message;
      });
    }, $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null, $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        $scope.passwordDetails = null, Authentication.user = response, $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]), angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user, $scope.user || $location.path('/'), $scope.hasConnectedAdditionalSocialAccounts = function () {
      for (var i in $scope.user.additionalProvidersData)
        return !0;
      return !1;
    }, $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    }, $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null, $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        $scope.success = !0, $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    }, $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = !0, Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else
        $scope.submitted = !0;
    }, $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null, $http.post('/users/password', $scope.passwordDetails).success(function () {
        $scope.success = !0, $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]), angular.module('users').factory('Authentication', [function () {
    var _this = this;
    return _this._data = { user: window.user }, _this._data;
  }]), angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]), function () {
  describe('AuthenticationController', function () {
    var AuthenticationController, scope, $httpBackend, $stateParams, $location;
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function () {
          return {
            compare: function (actual, expected) {
              return { pass: angular.equals(actual, expected) };
            }
          };
        }
      });
    }), beforeEach(module(ApplicationConfiguration.applicationModuleName)), beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
      scope = $rootScope.$new(), $stateParams = _$stateParams_, $httpBackend = _$httpBackend_, $location = _$location_, AuthenticationController = $controller('AuthenticationController', { $scope: scope });
    })), it('$scope.signin() should login with a correct user and password', function () {
      $httpBackend.when('POST', '/auth/signin').respond(200, 'Fred'), scope.signin(), $httpBackend.flush(), expect(scope.authentication.user).toEqual('Fred'), expect($location.url()).toEqual('/articles');
    }), it('$scope.signin() should fail to log in with nothing', function () {
      $httpBackend.expectPOST('/auth/signin').respond(400, { message: 'Missing credentials' }), scope.signin(), $httpBackend.flush(), expect(scope.error).toEqual('Missing credentials');
    }), it('$scope.signin() should fail to log in with wrong credentials', function () {
      scope.authentication.user = 'Foo', scope.credentials = 'Bar', $httpBackend.expectPOST('/auth/signin').respond(400, { message: 'Unknown user' }), scope.signin(), $httpBackend.flush(), expect(scope.error).toEqual('Unknown user');
    }), it('$scope.signup() should register with correct data', function () {
      scope.authentication.user = 'Fred', $httpBackend.when('POST', '/auth/signup').respond(200, 'Fred'), scope.signup(), $httpBackend.flush(), expect(scope.authentication.user).toBe('Fred'), expect(scope.error).toEqual(void 0), expect($location.url()).toBe('/articles');
    }), it('$scope.signup() should fail to register with duplicate Username', function () {
      $httpBackend.when('POST', '/auth/signup').respond(400, { message: 'Username already exists' }), scope.signup(), $httpBackend.flush(), expect(scope.error).toBe('Username already exists');
    });
  });
}(), ApplicationConfiguration.registerModule('users');'use strict';
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
ApplicationConfiguration.registerModule('users');