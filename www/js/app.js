/*
  File    : app.js
  Created : July 26, 2015
  by      : Joey Ga-as
*/


'use strict';

var db = null; // holds the webSQL database object

/*
*@name JWApp
*
*@description main app module
*/
angular.module('JWApp', ['ionic', 'ngCordova', 'JWApp.controllers', 'JWApp.services'])


/*
*@name run
*
*@description app runtime function
*/
.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });


  // Open app database that will be used through out the 
  // application 
  db = openDatabase('JW.db', '1.0', 'JW Assistant DB', 2 * 1024 * 1024);

  // Create application tables if not exists
  db.transaction(function(tx){
     tx.executeSql('CREATE TABLE IF NOT EXISTS notes(title unique, content)');
     tx.executeSql('CREATE TABLE IF NOT EXISTS dailytext(localDate unique, content, verses)');
     //tx.executeSql('DROP TABLE dailytext');
  });

})


/*
*@name config
*
*@description app config function
*/
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  // Home
  .state('app.home', {
    url: '/home',
    views: {
       'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
  })

  // library
  .state('app.library', {
    url: '/library',
    views: {
      'menuContent' : {
        templateUrl: 'templates/library.html',
        controller: 'LibCtrl'
      }
    }
  })
  // library book
  .state('app.book', {
    url: '/book/:title',
    views: {
      'menuContent' : {
        templateUrl: 'templates/book.single.html',
        controller: 'BookCtrl'
      }
    }
  })

  // notes
  .state('app.noteslist', {
    url: '/noteslist',
    views: {
      'menuContent' : {
        templateUrl: 'templates/noteslist.html',
        controller: 'NotesCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
