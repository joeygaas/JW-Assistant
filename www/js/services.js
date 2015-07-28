/*
  File    : services.js
  Created : July 26, 2015
  by      : Joey Ga-as
*/

'use strict';


angular.module('JWApp.services', [])
.constant('assetsPath', 'assets/') // Assets File base path

/*
*@name AssetsSvc
*
*@description Get all the app assets and load it into the localStorage
*/
.factory('AssetsSvc', function($http, assetsPath){
	return {
		/*
		*@name getLang
		*
		*@description get the lang.json file and store it in the locaStorage
		*/
		getLang : function(){
			$http.get(assetsPath + 'langs.jw').success(function(data){
				localStorage['langs'] = angular.toJson(data);
			}).error(function(error){
				alert('Cannot Find lang.jw file');
			});
		},


		/*
		*@name getMenus
		*
		*@description get the menus.json file and store it in the locaStorage
		*/
		getManifest : function(lang){
			$http.get(assetsPath + lang + '/manifest.jw').success(function(data){
				localStorage['manifest'] = angular.toJson(data);	
			}).error(function(error){
				alert('Cannot Find menus.json file');
			});
		},
	};
})



/*
*@name BookAssetsSvc
*
*@description Get all the Selected Book assts
*/
.factory('DailyTextSvc', function($http, assetsPath){
	/*
	*@name toDate
	*
	*@description convert daily text title to date
	*/
	var toDate = function(data, lang){
		var localDate = null;
		var title = data.split(' ');

		if(lang == 'tl'){

			switch(title[1]){
				case 'Enero':
					localDate = 1 + '-' +title[2];
					break;
				case 'Pebrero':
					localDate = 2 + '-' +title[2];
					break;
			 	case 'Marso':
					localDate = 3 + '-' +title[2];
					break;
				case 'Abril':
					localDate = 4 + '-' +title[2];
					break;
				case 'Mayo':
					localDate = 5 + '-' +title[2];
					break;
				case 'Hunyo':
					localDate = 6 + '-' +title[2];
					break;
				case 'Hulyo':
					localDate = 7 + '-' +title[2];
					break;
				case 'Agosto':
					localDate = 8 + '-' +title[2];
					break;
				case 'Setyembre':
					localDate = 9 + '-' +title[2];
					break;
				case 'Oktubre':
					localDate = 10 + '-' +title[2];
					break;
				case 'Nobyembre':
					localDate = 11 + '-' +title[2];
					break;
				case 'Disyembre':
					localDate = 12 + '-' +title[2];
					break;
				default:
					console.log('Not match');
					break;
			}
		}

		return localDate;
	};

	return {
		/*
		*@name getContent
		*
		*@description Get the daily text files and store it in webSQL
		*/
		getContent : function(path, lang){
			$http.get(assetsPath + path + '/content.opf').success(function(data){
				var xmlDoc = $.parseXML(data);
				var xml = $(xmlDoc);

				var pages = xml.find('item');
				
				var query = 'INSERT INTO dailytext(localDate, content, verses) VALUES(?, ?, ?)';

				// Get the html file and parse it as xml 
				// then get the needed value and store it in the dailytext table
				for(var i = 0; i < pages.length; i++){
					var template = $(pages[i]).attr('href');
				
					$http.get(assetsPath + path + '/' + template)
					.success(function(data){
						var docXml = $.parseXML(data);
						var doc = $(docXml);

						var title = doc.find('title')[0].innerHTML;
						
						var newData = {}; // Holds the new data
						// Convert  title to data format
						newData.localDate = toDate(title, lang);

						if(newData.localDate != undefined){
							newData.content = doc.find('.pGroup')[0].innerHTML;
							newData.verses = doc.find('.groupExt')[0].innerHTML;

							// Save data into webSQL
							db.transaction(function(tx){
								tx.executeSql(query, [newData.localDate, newData.content, newData.verses]);
							});
						}
					}).error(function(error){	
						alert(template + ' is missing');
					});
				}
			}).error(function(error){
				alert('Book toc.ncx file is missing');
			});
		}
	};
})


/*
*@name NotesCRUD
*
*@description Notes crud service
*/
.factory('NotesCRUD', function(){
	return {
		/*
		*@name all
		*
		*@param callback {{ function }} callback function
		*@return array
		*
		*@description get all the data
		*/
		all : function(callback){
			var newData = []; // holds the new data
			var query = 'SELECT rowid, title, content FROM notes';

			db.transaction(function(tx){
				tx.executeSql(query, [], function(tx, results){

					var rows = results.rows;

					if(rows.length != 0){
						for(var i = 0; i < rows.length; i++){
							var tmp = {};
							tmp.id = rows[i]['rowid'];
							tmp.title = rows[i]['title'];
							tmp.content = rows[i]['content'];

							newData.push(tmp);
						}

						callback(newData); // pass the data to the callback function
					}else {
						newData = false
						callback(newData);
					}

				});
			}, function(error){
				alert(error.message);
			});
		},


		/*
		*@name create
		*
		*@description create new data
		*/
		create : function(notes) {
			var query = 'INSERT INTO notes(title, content) VALUES(?, ?)';
			db.transaction(function(tx){
				tx.executeSql(query, [notes.title, notes.content]);
			}, function(error){
				switch(error.code){
					case 6 : 
						alert('Title already exist please choose a new title');
						break;

					default :
						alert(error.message);
						break;
				}
			});
		},


		/*
		*@name get
		*
		*@param id {{ int }} notes id
		*@param callback {{ function }} callback function
		*@return object
		*
		*@description get selected data
		*/
		get : function(id, callback) {
			var data = {}; // holds the retrieve data
			var query = 'SELECT rowid, title, content FROM notes WHERE rowid=?';

			db.transaction(function(tx){
				tx.executeSql(query, [id], function(tx, results){

					var row = results.rows;

					if(row.length != 0){
						data.id = row[0].rowid;
						data.title = row[0].title;
						data.content = row[0].content;

						callback(data); // pass the retrieve data into the callback function
					}else {
						alert("The selected data don't exist in the database!");
					}

				});
			}, function(error){
				alert(error.message);
			});
		},


		/*
		*@name update
		*
		*@description update selected data
		*/
		update : function(data) {
			var query = 'UPDATE notes SET title=?, content=? WHERE rowid=?';
			db.transaction(function(tx){
				tx.executeSql(query, [data.title, data.content, data.id]);
			}, function(error){
				switch(error.code){
					case 6 : 
						alert('Title already exist please choose a new title');
						break;

					default :
						alert(error.message);
						break;
				}
			});
		},


		/*
		*@name delete
		*
		*@description delete selected data
		*/
		delete : function(id) {
			var query = 'DELETE FROM notes WHERE rowid=?';
			db.transaction(function(tx){
				tx.executeSql(query, [id]);
			}, function(error){
				alert(error.message);
			});
		}
	};
});	

