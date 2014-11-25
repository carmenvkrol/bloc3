'use strict';
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
    }, $resource('/article_tags');
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
}(), ApplicationConfiguration.registerModule('users'), angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies), angular.module(ApplicationConfiguration.applicationModuleName).config([
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
    }, $resource('/article_tags');
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
}(), ApplicationConfiguration.registerModule('users'), ApplicationConfiguration.registerModule('articles'), angular.module('articles').run([
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
    }, $resource('/article_tags');
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
}(), ApplicationConfiguration.registerModule('users');