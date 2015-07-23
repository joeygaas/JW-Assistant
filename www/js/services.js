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
.constant('path', '/data/') // base path
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
				localStorage['lang'] = angular.toJson(response);
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
				localStorage['config'] = angular.toJson(response);
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
				localStorage['booksList'] = angular.toJson(response.books);
			});
		},


		/*
		*@GetData function
		*@name getBookToc
		*
		*@param lang {{ string }} file language
		*@param title {{ string }} file name
		*@param callback {{ function }} callback function
		*@return xml data
		*
		*@description get the books table of contents xml data
		*/
		getBookTocXML : function(lang, title, callback){
			var request = new XMLHttpRequest();
			request.open('GET', path + '/' + lang + '/' + title + '/OEBPS/toc.ncx');
			
			request.onreadystatechange = function(){
				// if the request is complete and was successful
				if(request.readyState === 4 && request.status === 200){
					// Get the type of the response
					var type = request.getResponseHeader('Content-Type');

					// Check type so we don't get HTML documents in the future.
					if(type == 'application/x-dtbncx+xml; charset=utf-8'){
						callback(request.responseXML); // assign xml data to the callback
					}
				}
			};

			request.send(null);
		}
	};
}])


/*
*@jwApp service
*@name NotesCRUD
*
*@description handles notes CRUD functions
*/
.factory('NotesCRUD', [function(){
	return {
		/*
		*@NotesCRUD method
		*@name all
		*
		*@description get all the notes
		*/
		all : function(){
			var storedNotes = angular.fromJson(localStorage['notes']);
			if(storedNotes == undefined){
				return false;
			}

			return storedNotes;
		},


		/*
		*@NotesCRUD method
		*@name get
		*
		*@description get a selected notes in the array
		*/
		get : function(title){
			var storedNotes = angular.fromJson(localStorage['notes']);
			
			for(var i = 0; i < storedNotes.length; i++){
				if(storedNotes[i]['title'] = title){
					return storedNotes[i];
				}
			}
			return false;
		},


		/*
		*@NotesCRUD method
		*@name remove
		*
		*@description remove the selected notes
		*/
		remove : function(title){
			var storedNotes = angular.fromJson(localStorage['notes']);
			for(var i = 0; i < storedNotes.length; i++){
				if(storedNotes[i]['title'] == title){
					delete storedNotes[i];
				}
			}


			localStorage['notes'] = angular.toJson(storedNotes);

			return true;
		},


		/*
		*@NotesCRUD method
		*@name save
		*
		*@description save the notes into the localStorage
		*/
		save : function(notes){
			var storedNotes = angular.fromJson(localStorage['notes']);
			var msg;

			if(storedNotes != undefined){
				// check if the notes title is already exist
				for(var i = 0; i < storedNotes.length; i++){
					if(storedNotes[i]['title'] == notes.title){
						// prompt the user and let him choose another title
						var title = prompt('Title already exist. Please add a new one');
						storedNotes[i]['title'] = title; // store the new title
					}
				}
				// add the new notes in the array
				storedNotes.push(notes);
			}else {
				storedNotes = [];
				storedNotes.push(notes); 
			}

			localStorage['notes'] = angular.toJson(storedNotes);
			alert('Notes added successfuly'); // notify the user using alerbox 
		}
	};
}])


/*
*@jwApp service
*@name UtilityServices
*
*@description Application utitlity services
*/
.factory('UtilityServices', [function(){
	return {
		/*
		*@UtilityService function
		*@name bookNav
		*
		*@description create books navigation from xml data
		*/
		bookNavToJson : function(xmlData, path){
			var navMap = xmlData.getElementsByTagName('navMap'); // navigation list container tag
			var newData = []; // new data

			var navLabel = navMap[0].getElementsByTagName('navLabel'); // nav label array
			var navContent = navMap[0].getElementsByTagName('content'); // nav content array (contains the src attribute)

			for(var i = 0; i < navLabel.length; i++){
				var label = navLabel[i].textContent; // navLabel textContent
				var src = navContent[i].attributes[0].textContent; // navContent src attr textContent
				
				var json  = {}; // stores the json objects
				json.title = label; // the the title or the label of the nav 
				json.path = path + '/OEBPS/' +src;	// the path of the  nav

				newData.push(json);
				
			}

			return newData;
		}
	}
}]);