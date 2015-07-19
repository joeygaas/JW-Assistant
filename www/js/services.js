/*
  File  : controllers.js
  Date  : July 17, 2015
  By    : Joey Ga-as
*/

'use strict';

angular.module('jwApp')


/*
*@jwApp constants
*
*@description path of the file in the storage
*/
.constant('path', '/resources/') // base path
.constant('langFile', 'lang.json') // language file 
.constant('configFile', '/config.json') // menu file
.constant('booksList', '/booksList.json') // books list


/*
*@jwApp service
*@name GetData
*
*@description Get data from the file storage
*/
.factory('GetData', ['$http', 'path', 'langFile', 'configFile', 'booksList',
function($http, path, langFile, configFile, booksList){
	return {
		/*
		*@GetData function
		*@name getLang
		*
		*@return promise object
		*
		*@description Get the language data
		*/
		getLang : function(){
			$http.get(path + langFile).success(function(response){
				window.localStorage['lang'] = angular.toJson(response);
			});
		},


		/*
		*@GetData function
		*@name getMenu
		*
		*@param lang {{ string }} file language
		*@return promise object
		*
		*@description Get the config data
		*/
		getConfig : function(lang){
			$http.get(path + lang + configFile).success(function(response){
				window.localStorage['config'] = angular.toJson(response);
			});
		},


		/*
		*@GetData function
		*@name getMenu
		*
		*@param lang {{ string }} file language
		*@return promise object
		*
		*@description Get the books list data
		*/
		getBooksList : function(lang){
			$http.get(path + lang + booksList).success(function(response){
				window.localStorage['booksList'] = angular.toJson(response);
			});
		}
	};
}])