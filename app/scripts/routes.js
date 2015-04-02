/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

/*define(['./app'], function (app) {
    'use strict';
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'partials/partial1.html',
            controller: 'MyCtrl1'
        });

        $routeProvider.when('/view2', {
            templateUrl: 'partials/partial2.html',
            controller: 'MyCtrl2'
        });

        $routeProvider.otherwise({
            redirectTo: '/view1'
        });
    }]);
});*/
define(['./app'], function(app) {
    'use strict';
    return app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider, $httpProvider, $sceDelegateProvider) {
        $stateProvider.state('view1',{
            url: '/view1',
            templateUrl: 'views/partial1.html',
            controller:'MyCtrl1'
        })
        .state('view2',{
            url: '/view2',
            templateUrl: 'views/partial2.html',
            controller: 'MyCtrl2'
        })
        .state('root',{
            url: '/',
            views: {
                '': {
                    templateUrl: 'views/main.html'
                },
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'MyCtrl1',
                    controllerUrl: 'scripts/controllers/my-ctrl-1'
               },
               'footer': {
                    templateUrl: 'views/footer.html',
                    controller: 'MyCtrl1',
                    controllerUrl: 'scripts/controllers/my-ctrl-1'
              },
               'demo': {
                    templateUrl: 'views/demo.html',
                    controller: 'DemoCtrl',
                    controllerUrl: 'scripts/controllers/demo'
              }
            }
        })
        .state('landing-page',{
            url: '/landing-page',
            views: {
                'landingPage': {
                    templateUrl: 'views/landingPage.html'
                }
            }
        });
        $urlRouterProvider.otherwise('/');
    })
});