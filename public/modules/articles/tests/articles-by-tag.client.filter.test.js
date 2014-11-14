'use strict';

describe('Filter: articlesByTag', function () {

  // load the filter's module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  // initialize a new instance of the filter before each test
  var articlesByTagFilter;

  beforeEach(inject(function ($filter) {
    articlesByTagFilter = $filter('articlesByTag');
  }));

  /*
  it ('articleByTag filter should return articles if selectedTags length is more than zero', function(){
  
  });

  it('articleByTag filter should return tag.text for each article that has tag', function(){
  
  });

  it('articleByTag filter should push tag.text to filtered', function(){
  
  });
  */

  /*it('should output 7 if 7 days away', function() {
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