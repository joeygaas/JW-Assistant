/*
  File  : controllers.js
  Date  : July 17, 2015
  By    : Joey Ga-as
*/

'use strict';

angular.module('jwApp')

/*
*@jwApp controller
*@name TopController
*
*@description contains the app uitility functions
*/
.controller('TopController', ['$scope', '$rootScope', 'GetData',
function($scope, $rootScope, GetData){
	/*
	*@TopController function
	*@name setLang
	*
	*@description set the application language
	*/
	$scope.setLang = function(lang){
		localStorage['appLang'] = lang;
		// Reload the page
		location.reload();
	}


	/*
	*@TopController function
	*@name loadLang
	*
	*@description Store all the needed assets in localStorage, indexDB or webSQL
	*/
	$scope.loadAssets = function(){
		// load all the language file
		GetData.getLang();

		// Save the config file in the local storage
		GetData.getConfig($scope.appLang);

		// load the books lists file
		GetData.getBooksList($scope.appLang);
		// load all the books content file
	};


	// Get the app language value in the localStorage.
	// If the value if undifined set the default value to tl( tagalog).
	$scope.appLang = window.localStorage['appLang'];
	if($scope.appLang == undefined){
		// app language is undefined set the default value
		window.localStorage['appLang'] = 'tl';
		$scope.appLang = window.localStorage['appLang'];
	}

	// Store all the needed assets in the localStorage, indexDB or webSQL.
	// Depending on how big the data is.
	$scope.loadAssets();

	// Extract the needed files 
	var config = angular.fromJson(localStorage['config']); // application config file
	var languages = angular.fromJson(localStorage['lang']); // application supported languages
	
	// Set the ion-side-menu rigth items
	$rootScope.sideMenuRightHeader = config.sideMenuRightHeader; // side menu header
	$rootScope.languages = languages; // side menu itmes

}])


/*
*@jwApp controller
*@name HomeController
*
*@description contains the #/ (index) route behavior functions
*/
.controller('HomeController', ['$scope', '$rootScope', 'GetData',
function($scope, $rootScope, GetData){
	// Hide the book table of contents navigation
	$rootScope.book = false;

	// Extract the files from the localStorage
	var appLang = localStorage['appLang']; // Application current language	
	var config = angular.fromJson(localStorage['config']); // application config file
	var booksList = angular.fromJson(localStorage['booksList']) // books list

	$scope.books = booksList;

	// Set the ion-side-menu left values
	$rootScope.sideMenuLeftHeader = config.JWAssistant;   // ion-side-menu left header
	$rootScope.menus = config.menu;  // ion-side-menu left items

	// set the height of the widget class
	$('.widget').css('height', screen.height * .20 + 'px');

}])


/*
*@jwApp controller
*@name LibraryController
*
*@description contains the /library route functions
*/
.controller('LibraryController', ['$scope', '$rootScope', 'GetData',
function($scope, $rootScope, GetData){
	// Hide the book table of contents navigation
	$rootScope.book = false;

	// Extract the needed data from the localStorage
	var appLang = localStorage['appLang']; // Application current language
	var config = angular.fromJson(localStorage['config']); // configuration files
	var booksList = angular.fromJson(localStorage['booksList']) // books list

	// Set the page title
	$scope.pageTitle = config.libraryPageTitle;

	// Set the ion-side-menu left values
	$rootScope.sideMenuLeftHeader = config.JWAssistant;   // ion-side-menu left header
	$rootScope.menus = config.menu;  // ion-side-menu left items

	// Pass the variables into the view
	$scope.books = booksList; // books list

}])


/*
*@jwApp controller
*@name BookController
*
*@description contains the #/book/:book route behavior functions
*/
.controller('BookController', ['$scope', '$rootScope', '$stateParams', 'GetData', 'UtilityServices',
function($scope, $rootScope, $stateParams, GetData, UtilityServices){
	/*
	*@BookController function
 	*@name loadContent
	*
	*@description load the slected book contents in the iframe
	*/
	$rootScope.loadContent = function(path){
		$scope.content = path;
	}

	// Show the book table of contents navigation
	$rootScope.book = true;

	// Extract the needed data from the localStorage
	var appLang = localStorage['appLang']; // Application current language
	var config = angular.fromJson(localStorage['config']); // configuration files
	var booksList = angular.fromJson(localStorage['booksList']) // books list
	
	// Set the page title
	$scope.pageTitle = $stateParams.title;



	// Get the epub book toc.ncx and genereate needed content from it
	GetData.getBookTocXML(appLang, $stateParams.book, function(data){
		// convert the books toc.xml to json object for easy access
		var bookNav = UtilityServices.bookNavToJson(data, '/data/' + appLang + '/' + $stateParams.book);
		
		$rootScope.sideMenuLeftHeader = config.library; // ion-side-menu-header
		$rootScope.menus = bookNav; // ion-side-menu left items

		// Set the default iframe src value
		$scope.content = bookNav[0].path;
		// Set the height of the iframe according to 
		// the device screen height  for better dislplay.
		$('iframe').height(screen.height);


	});

}]);