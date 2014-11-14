'use strict';

describe('Articles', function(){
  var Articles,
      resource;

  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($injector, _$resource_){
    Articles = $injector.get('Articles');
    resource = _$resource_;
  }));

  /*it('lodash service should get lodash window object', function() {
    expect(_).toEqual(window._);
  });*/

});