/*
*	File	: app.js
*	Date	: July 17, 2015
*	By		: Joey ga-as
*/

'use strict';


/*
*@angular module
*@name jwApp
*
*@description jwApp main module
*/
var jwApp = angular.module('jwApp', ['ionic', 'ngCookies'])

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
	var basePath = '/templates/'; // tempalte base path
	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: basePath + 'home.html',
			controller: 'HomeController'
		})

		// Book Routes
		.state('book', {
			url: '/book/:id',
			templateUrl: basePath + 'booksTpl/overview.html',
			controller: 'BookController'
		});
}]);