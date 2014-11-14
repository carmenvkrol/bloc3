'use strict';

describe('Filter: articlesByTag', function () {

  // load the filter's module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  // initialize a new instance of the filter before each test
  var articlesByTagFilter;

  beforeEach(inject(function ($filter) {
    articlesByTagFilter = $filter('articlesByTag');
  }));

  it ('articleByTag filter should return tags if selectedTags length is more than zero', function(){
    expect(articlesByTagFilter(
      [{
        tags: [{'text': 'tag-3'}]
      }],
      [
        'tag-3'
      ]))
      .toEqual([{tags: [{'text': 'tag-3'}]}]);
  });

  it('articleByTag filter should return articles if selectedTags.length is 0', function(){
    expect(articlesByTagFilter(
      [{
        tags: [{'text':'tag-3'}]
      }],
      []))
      .toEqual([{
        tags: [{'text':'tag-3'}]
      }]);
  });

});