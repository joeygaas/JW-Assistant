/*
  File    : controllers.js
  Created : July 26, 2015
  by      : Joey Ga-as
*/

'use strict';


angular.module('JWApp.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, AssetsSvc, NotesCRUD) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Check if the application language is set
  // if not set reset to default language
  var lang = localStorage['appLang'];
  if(lang == undefined){
    localStorage['appLang'] = 'tl';
    lang = localStorage['appLang'];
  }

  // Create the notes modal box
  $ionicModal.fromTemplateUrl('add-notes.html', function(modal){
    $scope.notesModal = modal;
  }, {
    scope : $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });


  /*
  *@name showNotesModal
  *
  *@description show notes modal
  */
  $scope.showNotesModal = function(){
    $scope.notesModal.show();
  }


  /*
  *@name hideNotesModal
  *
  *@description hide notes modal
  */
  $scope.hideNotesModal = function(){
    $scope.notesModal.hide();
  }

  /*
  *@name addNotes
  *
  *@description add the notes data
  */
  $scope.addNotes = function(data){
    NotesCRUD.create(data); // Create the data

    // Update the noteslist 
    NotesCRUD.all(function(response){
      $rootScope.noteslist = response;
      data.title = "";
      data.content = "";
    });

    $scope.notesModal.hide();
  }


  // Load all the needed files in the locaStorage
  AssetsSvc.getLang();
  AssetsSvc.getManifest(lang);
})


/*
*@name HomeCtrl
*
*@description app/home route controller
*/
.controller('HomeCtrl', function($scope, $rootScope, DailyTextSvc) {
    var appLang = localStorage['appLang'];
    var manifest = angular.fromJson(localStorage['manifest']); // manifest
    $rootScope.leftMenuNavs = manifest.leftNav; // left menu navs

    DailyTextSvc.getContent(appLang + '/dailytxt', appLang);
})


/*
*@name LibCtrl
*
*@description app/library route controller
*/
.controller('LibCtrl', function($scope){
  
})


/*
*@name BookCtrl
*
*@description app/book route controller
*/
.controller('BookCtrl', function($scope, $stateParams){
    
})


/*
*@name NotesCtrl
*
*@description app/notes route controller
*/
.controller('NotesCtrl', function($scope, $rootScope, $ionicModal, NotesCRUD){
   // Get all the notes data
   NotesCRUD.all(function(data){
      $rootScope.noteslist = data;
   });


  // Create the edit notes modal box
  $ionicModal.fromTemplateUrl('edit-notes.html', function(modal){
    $scope.editNotesModal = modal;
  }, {
    scope : $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });


  /*
  *@name getNotes
  *
  *@description get the selected notes data
  */
  $scope.getNotes = function(id){
    $rootScope.notesUpdate = {}; // holds the retrieve data
    
    // Get the data and fill the form with
    // the retrieve data
    NotesCRUD.get(id, function(data){
      $rootScope.notesUpdate.title = data.title;
      $rootScope.notesUpdate.content = data.content;
      $rootScope.notesUpdate.id = data.id;
      
      // Show the edit notes modal
      $scope.editNotesModal.show();
    });
  }


  /*
  *@name hideEditNotes
  *
  *@description hide the edit notes modal
  */
  $scope.hideEditNotes = function(){
     $scope.editNotesModal.hide();
  }


  /*
  *@name updateNotes
  *
  *@description update the selected notes
  */
  $scope.updateNotes = function(data){
      // Update the data
      NotesCRUD.update(data);

      // Update the notes list
      NotesCRUD.all(function(data){
        $rootScope.noteslist = data;
      });
      // Hide the edit notes modal
      $scope.editNotesModal.hide();
  }


  /*
  *@name deleteNotes
  *
  *@description delete the selected notes
  */
  $scope.deleteNotes = function(id){
      // Delete the data
      NotesCRUD.delete(id);

      // Update the notes list
      NotesCRUD.all(function(data){
        $rootScope.noteslist = data;
      });
      // Hide the edit notes modal
      $scope.editNotesModal.hide();
  }

}); 

