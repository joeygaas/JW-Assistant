/*
  File  : app.js
  Date  : July 17, 2015
  By    : Joey Ga-as
*/

'use strict';

var jwApp = angular.module('jwApp', ['ionic'])


/*
*@jwApp config
*
*@description app main configuration
*/
.config(['$stateProvider', function($stateProvider){

  /*
  *@config routes
  *
  *@description app routes
  */
  $stateProvider
  .state('index', {
    url : '/',
    templateUrl : 'home.html'
  })
}]);