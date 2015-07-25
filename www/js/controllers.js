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
.controller('TopController', ['$scope', '$rootScope', '$ionicModal', 'GetData', 'NotesCRUD',
function($scope, $rootScope, $ionicModal, GetData, NotesCRUD){
	/*
	*@TopController method
	*@name setLang
	*
	*@description set the application language
	*/
	$scope.setLang = function(lang){
		localStorage['appLang'] = lang;
		// Reload the page
		location.reload();
	};


	/*
	*@TopController method
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


	// Create add notes modal
	 $ionicModal.fromTemplateUrl('add-notes.html', function(modal) {
	    $scope.addNotesModal = modal;
	 }, {
	    scope: $scope
	 });

	 //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.addNotesModal.remove();
	  });


	/*
	*@TopController method
	*@name addNotes
	*
	*@description Show the add notes modal form
	*/
	$scope.addNotes = function(){
		$scope.addNotesModal.show();
	};


	/*
	*@TopController method
	*@name cancelNotes
	*
	*@description Hide the add notes modal form
	*/
	$scope.closeAddNotes = function(){
		$scope.addNotesModal.hide();
	};


	/*
	*@TopController method
	*@name saveNotes
	*
	*@description Save the notes in the local storage
	*/
	$scope.saveNotes = function(notes){
		NotesCRUD.save(notes); // save the notes data in the localStorage
		$scope.addNotesModal.hide();

		// Clear the value of the form
		notes.title = "";
		notes.content = "";

		$rootScope.notesList = NotesCRUD.all();
	};	


	// Create search modal
	$ionicModal.fromTemplateUrl('search-modal.html', function(modal) {
	    $scope.searchModal = modal;
	}, {
	    scope: $scope
	});

	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
	    $scope.searchModal.remove();
	});


	/*
	*@TopController method
	*@name search
	*
	*@description show the search modal
	*/
	$scope.search = function(){
		$scope.searchModal.show();
	}


	/*
	*@TopController method
	*@name closeSearch
	*
	*@description close the search modal
	*/
	$scope.closeSearch = function(){
		$scope.searchModal.hide();
	}

	// Get the app language value in the localStorage.
	// If the value if undifined set the default value to tl( tagalog).
	$scope.appLang = window.localStorage['appLang'];
	if($scope.appLang == undefined){
		// app language is undefined set the default value
		localStorage['appLang'] = 'tl';
		$scope.appLang = localStorage['appLang'];
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

	// Set the main content of the view
	$scope.books = booksList; // list of books
	$scope.YearlyTxt = config.YearlyTxt; // Yearly text
	$scope.arrowBox = config.arrowBox; // arrow box label

	// Set the ion-side-menu left values
	$rootScope.sideMenuLeftHeader = config.JWAssistant;   // ion-side-menu left header
	$rootScope.menus = config.menu;  // ion-side-menu left items

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
	*@BookController method
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

}])


/*
*@jwApp controller
*@name NotesController
*
*@description contains the #/notes route behavior functions
*/
.controller('NotesController', ['$scope', '$rootScope', '$stateParams', '$location', 'NotesCRUD',
function($scope, $rootScope, $stateParams, $location, NotesCRUD){
	$rootScope.book = false;
	
	// Extract the needed data from the localStorage
	var appLang = localStorage['appLang']; // Application current language
	var config = angular.fromJson(localStorage['config']); // configuration files
	
	// Set the page title
	$scope.pageTitle = config.notesPageTitle;

	// Set the ion-side-menu left values
	$rootScope.sideMenuLeftHeader = config.JWAssistant;   // ion-side-menu left header
	$rootScope.menus = config.menu;  // ion-side-menu left items

	var notes = NotesCRUD.all(); // Get all the notes
	if(notes){
		$rootScope.notesList = notes;
	}

	
	// Run only this function if the $stateParams is defined
	if($stateParams.title != undefined){
		var notesData = NotesCRUD.get($stateParams.title);
		$scope.oldNotes = {};

		if(notesData != false){
			$scope.pageTitle = $stateParams.title;
			$scope.oldNotes.title = notesData.title;
			$scope.oldNotes.content = notesData.content;
		}
	}


	/*
	*@NotesController method
 	*@name removeNotes
	*
	*@description remove the notes from the storage
	*/
	$scope.deleteNotes = function(title){
		var remove = NotesCRUD.remove(title);
		if(remove){
			$location.path('/notes');
		}else {
			alert("Title is empty");
		}
	}


	/*
	*@NotesController method
 	*@name editNotes
	*
	*@description remove the notes from the storage
	*/
	$scope.editNotes = function(notes){
		// Remove the stored notes first berfore storing a new one
		// to avoid duplicated notes
		var remove = NotesCRUD.remove(notes.title);
		if(remove){
			var save = NotesCRUD.save(notes);
			if(save){
				$location.path('/notes');
			}else {
				alert("Fields are required..");
			}
		}else {
			alert("Fields are required..");
		}
	}
	
}]);