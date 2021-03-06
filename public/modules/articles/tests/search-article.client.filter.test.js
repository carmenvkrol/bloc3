'use strict';

describe('Filter: searchArticle', function () {

  // load the filter's module
  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  // initialize a new instance of the filter before each test
  var searchArticleFilter;

  beforeEach(inject(function ($filter) {
    searchArticleFilter = $filter('searchArticle');
  }));

  it ('searchArticle filter should return items if searchText is undefined', function() {
    expect(searchArticleFilter(
     [{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{'text': 'tag-3'}]
      }],
      undefined
    ))
    .toEqual([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{'text': 'tag-3'}]
    }]);
  });

  it('searchArticle filter should return articles that contain searchText', function() {
    expect(searchArticleFilter(
     [{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{'text': 'tag-3'}]
      }],
      'MEA'
    ))
    .toEqual([{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{'text': 'tag-3'}]
    }]);
  });

  it('searchArticle filter should not return articles that do not contain searchText', function() {
    expect(searchArticleFilter(
     [{
        _id: '525cf20451979dea2c000001',
        title: 'An Article about MEAN',
        link: 'http://www.google.com',
        content: 'MEAN rocks!',
        tags: [{'text': 'tag-3'}]
      }],
      'test'
    ))
    .toEqual([]);
  });


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