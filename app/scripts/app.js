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
      .state('landing-page', {
        url: '/landing-page',
        views: {
          'landingPage': {
            templateUrl: 'views/landing-page.html'
          }
        }
      })
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
      // 注册登录流程
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
        url: '/register/:inviteCode',
        views: {
          '': {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl',
            controllerUrl: 'scripts/controllers/register'
          }
        }
      })
      .state('root.register-success', {
        url: '/register-success/:userId',
        views: {
          '': {
            templateUrl: 'views/register-success.html',
            controller: 'RegisterYeepayCtrl',
            controllerUrl: 'scripts/controllers/register-yeepay'
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

      // 项目列表
      .state('root.project-lists', {
        url: '/projects',
        views: {
          '': {
            templateUrl: 'views/project-lists.html'
          }
        }
      })
      // 项目详情
      .state('root.project-details', {
        url: '/projects/:number',
        views: {
          '': {
            templateUrl: 'views/project-details.html',
            controller: 'ProjectDetailsCtrl',
            controllerUrl: 'scripts/controllers/project-details'
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

  }]);

p2pSiteMobApp.run(function($rootScope, $location, $window, $http, $state) {
  $rootScope.$on('$stateChangeStart', function() {
    $rootScope.showMe = false;

  });

});

p2pSiteMobApp.constant('DEFAULT_DOMAIN', '/hongcai/rest');
