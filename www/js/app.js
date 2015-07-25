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
var jwApp = angular.module('jwApp', ['ionic', 'ngTouch'])

/*
*@jwApp config
*
*@description app main configuration
*/
.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
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
			controller: 'HomeController',
			cache: false
		})

		// 
		.state('library', {
			url: '/library',
			templateUrl: basePath + 'booksTpl/library.html',
			controller: 'LibraryController',
			cache: false
		})

		// Book Routes
		.state('books', {
			url: '/book/:book/:title',
			templateUrl: basePath + 'booksTpl/content.html',
			controller: 'BookController',
			cache: false
		})

		// Notes Routes
		.state('notesList', {
			url: '/notes',
			templateUrl: basePath + 'booksTpl/notes.html',
			controller: 'NotesController',
			cache: false
		})
		.state('noteTitle', {
			url: '/notes/:title',
			templateUrl: basePath + 'booksTpl/edit.html',
			controller: 'NotesController',
			cache: false
		});
		// Redirect the page to index if 
		// the route is invalid
		$urlRouterProvider.otherwise('/');
}])


/*
*@jwApp run
*
*@description runtime function
*/
.run(['$state', '$rootScope', '$ionicLoading', function($state, $rootScope, $ionicLoading){
	$rootScope.$on('$stateChangeStart', function(){
		$ionicLoading.show({
			template : 'Loading...'
		});
	});

	$rootScope.$on('$stateChangeSuccess', function(){
		$ionicLoading.hide();
	});
}]);