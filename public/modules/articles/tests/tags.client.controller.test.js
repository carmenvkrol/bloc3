'use strict';

(function() {
	// Tags Controller Spec
	describe('Tags Controller Tests', function() {
		// Initialize global variables
		var TagsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Tags controller.
			TagsController = $controller('TagsController', {
				$scope: scope
			});
		}));

		it('$scope.findTags() should find tags', function() {
			var sampleTag = {
				'tag-1':{}
			};

			var sampleTags = [sampleTag];

			$httpBackend.expectGET('/article_tags').respond(sampleTags);

			scope.findTags();

			$httpBackend.flush();

			expect(scope.tags).toEqualData(sampleTags);
		});

		it('$scope.getArticles() should get articles', function() {
			var articles = [];

			var sampleArticle = {
				title: 'An Article about MEAN',
				link: 'http://www.google.com',
				content: 'MEAN rocks!',
				tags: [{'text': 'tag-3'}]
			};

			var sampleArticles = [sampleArticle];

			$httpBackend.expectGET('/articles').respond(sampleArticles);

			scope.getArticles();

			$httpBackend.flush();

			expect(scope.articles).toEqualData(sampleArticles);
		});

		it('$scope.updateTag(theTag) should update tag', function() {
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

		it('$scope.deleteTag(tag) should delete tag', function() {

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

		it('$scope.showMessage(message) should set $scope.message to mesasge and return true', function(){
			scope.showMessage('test');
			expect(scope.message).toEqual('test');
			expect(scope.showMessage('test')).toBe(true);
		});
	});
}());