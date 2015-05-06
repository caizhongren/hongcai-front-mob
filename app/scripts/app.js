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
  'config',
  'ipCookie',
  'angularMoment',
  'angular-md5'
]);

p2pSiteMobApp
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$uiViewScrollProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $uiViewScrollProvider) {
    $uiViewScrollProvider.useAnchorScroll();
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
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
        url: '/register/:openId/:inviteCode',
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
      .state('root.yeepay-callback', {
        url: '/yeepay-callback/:type/:status',
        views: {
          '': {
            templateUrl: 'views/yeepay-callback.html',
            controller: 'YeepayCallbackCtrl',
            controllerUrl: 'scripts/controllers/yeepay-callback'
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
    // .state('root.project-list', {
    //     url: '/projects',
    //     views: {
    //       '': {
    //         templateUrl: 'views/project/project-list.html',
    //         controller: 'ProjectListCtrl',
    //         controllerUrl: 'scripts/controllers/project/project-list'
    //       }
    //     }
    //   })
      // 项目详情
      .state('root.project-detail', {
        url: '/projects/:number',
        views: {
          '': {
            templateUrl: 'views/project/project-detail.html',
            controller: 'ProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/project-detail'
          }
        }
      })
      .state('root.funds-project-detail', {
        url: '/funds-projects/:number',
        views: {
          '': {
            templateUrl: 'views/project/funds-project-detail.html',
            controller: 'FundsProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/funds-project-detail'
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
      // 个人中心
      .state('root.user-center', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/user-center/ab.html'
          }
        }
      })
      // 基本资料
      .state('root.user-center.account', {
        url: '/account',
        views: {
          '': {
            templateUrl: 'views/user-center/account.html',
            controller: 'AccountCtrl',
            controllerUrl: 'scripts/controllers/user-center/account'
          }
        }
      })
      .state('root.user-center.info', {
        url: '/info',
        views: {
          '': {
            templateUrl: 'views/user-center/info.html',
            controller: 'InfoCtrl',
            controllerUrl: 'scripts/controllers/user-center/info'
          }
        }
      })
      // 投资统计
      .state('root.user-center.investments-stat', {
        url: '/investments-stat',
        views: {
          '': {
            templateUrl: 'views/user-center/investments-stat.html',
            controller: 'InvestmentsStatCtrl',
            controllerUrl: 'scripts/controllers/user-center/investments-stat'
          }
        }
      })
      // 我的债券
      .state('root.user-center.credits', {
        url: '/credits',
        views: {
          '': {
            templateUrl: 'views/user-center/credit.html',
            controller: 'CreditCtrl',
            controllerUrl: 'scripts/controllers/user-center/credit'
          }
        }
      })
      // 我的订单
      .state('root.user-center.orders', {
        url: '/orders',
        views: {
          '': {
            templateUrl: 'views/user-center/order.html',
            controller: 'OrderCtrl',
            controllerUrl: 'scripts/controllers/user-center/order'
          }
        }
      })
      // 充值
      .state('root.user-center.recharge', {
        url: '/recharge',
        views: {
          '': {
            templateUrl: 'views/user-center/recharge.html',
            controller: 'RechargeCtrl',
            controllerUrl: 'scripts/controllers/user-center/recharge'
          }
        }
      })
      // 提现
      .state('root.user-center.withdraw', {
        url: '/withdraw',
        views: {
          '': {
            templateUrl: 'views/user-center/withdraw.html',
            controller: 'WithdrawCtrl',
            controllerUrl: 'scripts/controllers/user-center/withdraw'
          }
        }
      })
      // 银行卡管理
      .state('root.user-center.bankcard', {
        url: '/bankcard',
        views: {
          '': {
            templateUrl: 'views/user-center/bankcard.html',
            controller: 'BankcardCtrl',
            controllerUrl: 'scripts/controllers/user-center/bankcard'
          }
        }
      })
      // 站内消息
      .state('root.user-center.messages', {
        url: '/messages',
        views: {
          '': {
            templateUrl: 'views/user-center/message.html',
            controller: 'MessageCtrl',
            controllerUrl: 'scripts/controllers/user-center/message'
          }
        }
      })
      // 交易记录
      .state('root.user-center.deals', {
        url: '/deals',
        views: {
          '': {
            templateUrl: 'views/user-center/deal.html',
            controller: 'DealCtrl',
            controllerUrl: 'scripts/controllers/user-center/deal'
          }
        }
      })
      // 预约记录
      .state('root.demo', {
        url: '/demo',
        views: {
          '': {
            templateUrl: 'views/demo.html',
            controller: 'DemoCtrl'
          }
        }
      })
      // 常见问题
      .state('root.issue', {
        url: '/issue',
        views: {
          '': {
            templateUrl: 'views/issue.html',
            controller: 'IssueCtrl',
            controllerUrl: 'scripts/controllers/issue'
          }
        }
      })
      // 安全保障
      .state('root.safe', {
        url: '/safe',
        views: {
          '': {
            templateUrl: 'views/safe.html',
            controller: 'SafeCtrl',
            controllerUrl: 'scripts/controllers/safe'
          }
        }
      })
      // 宏财简介
      .state('root.about', {
        url: '/about',
        views: {
          '': {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerUrl: 'scripts/controllers/about'

          }
        }
      });
    $urlRouterProvider.otherwise('/');

}])
  .run(function($rootScope, DEFAULT_DOMAIN, $state, $location, $http, restmod) {
    var routespermission = [
      '/account',
      '/credits',
      '/investments-stat',
      '/order',
      '/withdraw',
      '/bankcard',
      '/deals',
      '/messages',
      '/recharge',
      '/orders',
      '/credits',
      '/info'
    ];
    var titleMap = {'issue': '常见问题', 'about': '帮助中心', 'safe': '安全保障', 'account': '账户总览'};
    $rootScope.$on('$stateChangeStart', function() {
      // $rootScope.showTitle = titleMap[path];
      $rootScope.showMe = false;
      var checkModel = restmod.model(DEFAULT_DOMAIN + '/users');
      checkModel.$find('checkSession').$then(function(response) {
        if (response.user) {
          $rootScope.isLogged = true;
          $rootScope.hasLoggedUser = response.user;
          //用户未登录状态
        } else if(response.ret === -1) {
          $rootScope.isLogged = false;
          $rootScope.hasLoggedUser = null;
          if (routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
            $location.path('/login');
          }
        }
      });
    });
    $rootScope.$on('$stateChangeSuccess', function() {
      var path = $location.path().split('/')[1];
      $rootScope.showPath = path;
      $rootScope.showTitle = titleMap[path];
    });
  })

  .constant('DEFAULT_DOMAIN', '/hongcai/rest');
