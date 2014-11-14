'use strict';

describe('lodash', function(){
  var _,
      window;

  beforeEach(module(ApplicationConfiguration.applicationModuleName));

  beforeEach(inject(function($injector, _$window_){
    _ = $injector.get('_');
    window = _$window_;
  }));

  it('lodash service should get lodash window object', function() {
    expect(_).toEqual(window._);
  });

});