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

	// extract the config file from the local storage
	var config = angular.fromJson(localStorage['config']);

	// Set the Global default value of the ion-side-menu left.
	// Other routes will overide this value.
	$rootScope.sideMenuLeftHeader = config.sideMenuLeftHeader;   // ion-side-menu left header
	$rootScope.menus = config.menu; 						   // ion-side-menu left items

	// Set the Global default value of the ion-side-menu right. 
	// Other routes will not overide this value.
	$scope.sideMenuRightHeader = config.sideMenuRightHeader;	   // ion-side-menu right header
	$scope.languages = angular.fromJson(localStorage['lang']); // ion-side-menu righ items
}])


/*
*@jwApp controller
*@name HomeController
*
*@description contains the #/ route behavior functions
*/
.controller('HomeController', ['$scope', '$rootScope', 'GetData',
function($scope, $rootScope, GetData){
	// Extract the files from the localStorage
	var appLang = localStorage['appLang']; // Application current language
	var config = angular.fromJson(localStorage['config']); // configuration files

	// Set the page title equevalent to the menu title that point to this page. I use config value 
	// here to let the title of the page change its value according to the application current language.
	$scope.pageTitle = config.menu[1]['title'];


}])


/*
*@jwApp controller
*@name TopController
*
*@description contains the #/book/:id route behavior functions
*/
.controller('BookController', ['$scope', '$stateParams', function($scope, $stateParams){
	console.log($stateParams.id)
}]);