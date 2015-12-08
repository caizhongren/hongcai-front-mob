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
  'infinite-scroll',
  'angular-md5',
  'restangular',
  'angular-svg-round-progress',
  // 'ui.bootstrap',
  'restangular'
]);

p2pSiteMobApp
  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$uiViewScrollProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $uiViewScrollProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $uiViewScrollProvider.useAnchorScroll();
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
            templateUrl: 'views/_footer.html',
            controller: 'RootCtrl',
            controllerUrl: 'scripts/controller/root-ctrl'
          }
        }
      })
      .state('root.main', {
        url: '/?tab&subTab',
        views: {
          '': {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerUrl: 'scripts/controllers/main'
          }
        }
      })

      // 忘记密码流程
      .state('root.getPwd1', {
        url: '/getPwd1',
        views: {
          '': {
            templateUrl: 'views/getPwd1.html',
            controller: 'GetPwdCtrl',
            controllerUrl: 'scripts/controllers/get-pwd-back'

          }
        }
      })
      // 忘记密码流程
      .state('root.getPwd2', {
        url: '/getPwd2/:captcha/:mobile',
        views: {
          '': {
            templateUrl: 'views/getPwd2.html',
            controller: 'GetPwdCtrl',
            controllerUrl: 'scripts/controllers/get-pwd-back'

          }
        }
      })
      // 注册登录流程
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
        url: '/yeepay-callback/:business/:status?amount',
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
      .state('root.current-deposit-detail', {
        url: '/current-deposit/:number',
        views: {
          '': {
            templateUrl: 'views/project/current-deposit-detail.html',
            controller: 'FundsProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/funds-project-detail'
          }
        }
      })
      // 宏金保详情页
      .state('root.project-detail', {
        url: '/project-detail',
        views: {
          '': {
            templateUrl: 'views/project/project-detail.html',
            //controller: 'FundsProjectDetailCtrl',
            //controllerUrl: 'scripts/controllers/project/funds-project-detail'
          }
        }
      })
      // 宏金保详情页更多详情
      .state('root.project-detail-more', {
        url: '/project-detail-more',
        views: {
          '': {
            templateUrl: 'views/project/project-detail-more.html',
            //controller: 'FundsProjectDetailCtrl',
            //controllerUrl: 'scripts/controllers/project/funds-project-detail'
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
        url: '/user-center',
        views: {
          'user-center': {
            templateUrl: 'views/user-center/user-center.html'/*,
            controller: 'UserCenterCtrl',
            controllerUrl: 'scripts/controller/user-center/user-center'*/
          },
          'user-center-toggle': {
            templateUrl: 'views/user-center/user-center-toggle.html',
            controller: 'UserCenterCtrl',
            controllerUrl: 'scripts/controller/user-center/user-center'
          }
        }
      })
      //我的账户
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
      //个人设置
      .state('root.user-center.setting', {
        url: '/setting',
        views: {
          '': {
            templateUrl: 'views/user-center/setting.html',
            controller: 'SettingsCtrl',
            controllerUrl: 'scripts/controllers/user-center/settings'
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
      // 基本资料
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
      // 我的债权
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
        url: '/recharge?amount',
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
      // 回款计划
      .state('root.user-center.payment-collection', {
        url: '/payment-collection',
        views: {
          '': {
            templateUrl: 'views/user-center/payment-collection.html',
            controller: 'PaymentCollectionCtrl',
            controllerUrl: 'scripts/controllers/user-center/payment-collection'
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
      // 易宝新页面打开中转页
      .state('root.yeepay-transfer', {
        url: '/yeepay-transfer/:type/:number?realName&idNo',
        views: {
          '': {
            templateUrl: 'views/yeepay-transfer.html',
            controller: 'YeepayTransferCtrl',
            controllerUrl: 'scripts/controllers/yeepay-transfer'
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
      })

      //点赞活动详情页
      .state('root.share-detail', {
        url: '/share-detail/:number',
        views: {
          '': {
            templateUrl: 'views/share/share-detail.html',
            controller: 'ShareDetailCtrl',
            controllerUrl: 'scripts/controllers/share/share-detail-ctrl'
          }
        }
      })  
          //点赞活动首页
      .state('root.share-home', {
        url: '/share-home?act&f',//f 表示渠道,act 表示活动
        views: {
          '': {
            templateUrl: 'views/share/share-home.html',
            controller: 'ShareHomeCtrl',
            controllerUrl: 'scripts/controllers/share/share-home-ctrl'
          }
        }
      })

          //体验金活动页
      .state('root.experience-activity', {
        url: '/experience-activity/:number?c',
        views: {
          '': {
            templateUrl: 'views/activity/experience-activity.html',
            controller: 'ExperienceActivityCtrl',
            controllerUrl: 'scripts/controllers/activity/experience-activity-ctrl'
          }
        }
      })
      //加息券活动页
      .state('root.rate-activity', {
        url: '/rate-activity',
        views: {
          '': {
            templateUrl: 'views/activity/rate-activity.html',
            controller: 'RateActivityCtrl',
            controllerUrl: 'scripts/controllers/share/rate-activity-ctrl'
          }
        }
      })
      //体验金落地页
      .state('root.experience-landing', {
        url: '/experience-landing',
        views: {
          '': {
            templateUrl: 'views/activity/experience-landing.html',
            //controller: 'ShareHomeCtrl',
            //controllerUrl: 'scripts/controllers/share/share-home-ctrl'
          }
        }
      })
      //串码活动页
      .state('root.exchange-code', {
        url: '/exchange-code',
        views: {
          '': {
            templateUrl: 'views/activity/exchange-code.html',
            //controller: 'ShareHomeCtrl',
            //controllerUrl: 'scripts/controllers/share/share-home-ctrl'
          }
        }
      })


    ;
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

}])
  .run(function($rootScope, DEFAULT_DOMAIN,  $q, $timeout, $state, $location, $http, restmod, config, Restangular, URLService, Utils) {
    Restangular.setBaseUrl('/hongcai/rest');
    Restangular.setDefaultHeaders({'Content-Type': 'application/json'})

    // 不需要显示footer的path
    var notShowFooterRoute = [
      'share-home',
      'share-detail',
      'experience-landing',
      'experience-activity',
      'rate-activity',
      'exchange-code'
    ];

    var routespermission = [
      '/user-center'
    ];
    var titleMap = {'issue': '常见问题', 'about': '帮助中心', 'safe': '安全保障', 'account': '账户总览'};
    $rootScope.$on('$stateChangeStart', function() {
      $rootScope.timeout = false;
      $timeout(function(){
          $rootScope.timeout = true;
      }, 400);


      $rootScope.showFooter = false;
      if (notShowFooterRoute.indexOf($location.path().split('/')[1]) === -1){
        $rootScope.showFooter = true;
      } 

      // $rootScope.showTitle = titleMap[path];
      $rootScope.showMe = false;
      $rootScope.checkSession = $q.defer();
      var $checkSessionServer = $http.get(DEFAULT_DOMAIN + '/users/checkSession');
      $checkSessionServer.success(function(response) {

        if (response.user) { // 已经授权过，1、登录 2未注册
          $rootScope.isLogged = true;
          $rootScope.hasLoggedUser = response.user;
          $rootScope.securityStatus = response.securityStatus;
          $rootScope.account = response.account;
          $rootScope.openid = response.user.openid;
          $rootScope.nickName = response.user.nickName;
          $rootScope.headImgUrl = response.user.headImgUrl;
          $rootScope.userInfo = response.user;
          $rootScope.voucher = response.voucher;

          $rootScope.checkSession.resolve(response);

          if (!response.user.mobile && !response.user.email && routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1){
            $location.path('/login');
          }
        } 

        else if(response.ret === -1) { //用户未登录，。

          if(!Utils.isWeixin()){
            return;
          }

          var wechat_code = $location.search().code;
          var redirect_uri = location.href;
          if (wechat_code){ // 用户未登录但已经有code，去登录
            restmod.model(DEFAULT_DOMAIN + '/desireUsers/').$find(wechat_code + '/openid').$then(function(response){
              $rootScope.isLogged = true;
              $rootScope.hasLoggedUser = response;
              $rootScope.userInfo = response;
              $rootScope.openid = response.openid;
              $rootScope.nickName = response.nickName;
              $rootScope.headImgUrl = response.headImgUrl;

              $rootScope.checkSession.resolve(response);
              if ($rootScope.openid && !response.user.mobile && !response.user.email && routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) { // 未注册，且访问的url需要注册，则需要跳转到注册页
                $location.path('/login');
              } else if (response.ret == -1){ // 未拿到openid再次请求授权
                var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid + 
                  "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
                window.location.href = wechatRedirectUrl;
              } else {
                $rootScope.checkSession.resolve(response);
              }
              
            });
          } else { // 未登录且还未授权

            var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid + 
              "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
            window.location.href = wechatRedirectUrl;

          }
          
        }


        // $rootScope.checkSession.resolve(response);
        // if (response.user) {
        //   $rootScope.isLogged = true;
        //   $rootScope.hasLoggedUser = response.user;
        //   $rootScope.securityStatus = response.securityStatus;
        //   $rootScope.account = response.account;
        //   //用户未登录状态
        // } else if(response.ret === -1) {
        //   $rootScope.isLogged = false;
        //   $rootScope.hasLoggedUser = null;
        //   if (routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
        //     $location.path('/login');
        //   }
        // }
      });
    });
    $rootScope.$on('$stateChangeSuccess', function() {
      var path = $location.path().split('/')[1];
      $rootScope.showPath = path;
      $rootScope.showTitle = titleMap[path];
    });
  })

  .constant('DEFAULT_DOMAIN', '/hongcai/rest')

  .constant('WEB_DEFAULT_DOMAIN', '/hongcai/api/v1');