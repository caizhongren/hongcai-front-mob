'use strict';
/**
 * @ngdoc overview
 * @name p2pSiteMobApp
 * @description
 * # p2pSiteMobApp
 *
 * Main module of the application.
 */
var p2pSiteMobApp = angular.module('p2pSiteMobApp', [
    'ngAnimate',
    'ngTouch',
    'famous.angular',
    'ui.router',
    'restmod',
    'angular-md5'
  ]);

p2pSiteMobApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
    $stateProvider
      .state('root', {
        abstract: true,
        views: {
          '': {
          templateUrl: 'views/root.html'
          },
          'header': {
            templateUrl: 'views/_header.html',
            controller: 'HeaderCtrl',
            controllerUrl: 'scripts/controller/header-ctrl'
          },
          'footer': {
            templateUrl: 'views/_footer.html'
          }
        }
      })
      .state('root.main', {
        url: '/',
        views: {
          '': {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerUrl: 'scripts/controllers/main'
          }
        }
      })
      .state('root.login', {
        url: '/login',
        views: {
          '': {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerUrl: 'scripts/controllers/login'

          }
        }
      })
      .state('root.loginByWechat', {
        url: '/login/:openId',
        views: {
          '': {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerUrl: 'scripts/controllers/login'

          }
        }
      })
      .state('root.register', {
        url: '/register',
        views: {
          '': {
            templateUrl: 'views/register.html'
          }
        }
      })
      .state('root.registerByWechat', {
        url: '/register/:openId',
        views: {
          '': {
            templateUrl: 'views/register.html'
          }
        }
      })
      .state('root.registration-agreement', {
        url: '/registration-agreement',
        views: {
          '': {
            templateUrl: 'views/registration-agreement.html'
          }
        }
      })
      .state('root.project-lists', {
        url: '/project-lists',
        views: {
          '': {
            templateUrl: 'views/project-lists.html'
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
    // $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');
    // $urlRouterProvider.when('', '/');
    //initialize get if not there
    // if (!$httpProvider.defaults.headers.get) {
    //   $httpProvider.defaults.headers.get = {};
    // }

  }]);

p2pSiteMobApp.run(function($rootScope, $location, $window, $http, $state) {
  $rootScope.$on('$stateChangeStart', function() {
    $rootScope.showMe = false;

  });

});
