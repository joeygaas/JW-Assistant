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
		// Welcome screen route
		.state('home', {
			url: '/',
			templateUrl: basePath + 'home.html',
			controller: 'HomeController'
		})

		// 
		.state('books', {
			url: '/books',
			templateUrl: basePath + 'booksTpl/library.html',
			controller: 'BookController'
		})

		// Book Routes
		.state('books`', {
			url: '/book/:path',
			templateUrl: basePath + 'booksTpl/content.html',
			controller: 'BookController'
		});
}]);