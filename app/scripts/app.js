'use strict';

/**
 * @ngdoc overview
 * @name p2pSiteMobApp
 * @description
 * # p2pSiteMobApp
 *
 * Main module of the application.
 */
angular
  .module('p2pSiteMobApp', [
    'ngAnimate',
    'ngTouch',
    'famous.angular',
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          '': {
          templateUrl: 'views/root.html'
          },
          'header': {
            templateUrl: 'views/header.html',
          },
          'footer': {
            templateUrl: 'views/footer.html'
          }
        }
      })
      .state('root.main', {
        url: '/',
        views: {
          '': {
            templateUrl: 'views/main.html'
          }
        }
      })
      .state('root.demo', {
        url: '/demo',
        views: {
          '': {
            templateUrl: 'views/demo.html',
            controller: 'DemoCtrl'

          }
        }
      })
      .state('root.about', {
        url: '/about',
        views: {
          '': {
            templateUrl: 'views/about.html'
          }
        }
      });
      $urlRouterProvider.otherwise('/');
  });
