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
  //'restangular',
  'textAngular'
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
        url: '/login?redirectUrl',
        data: {
          title: '登录'
        },
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
        data: {
          title: '注册'
        },
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
      .state('root.investmentplan-details', {
        url: '/investmentplan/:number',
        data: {
          title: '宏金盈'
        },
        views: {
          '': {
            templateUrl: 'views/project/funds-project-detail.html',
            controller: 'FundsProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/funds-project-detail'
          }
        }
      })
      // 零存宝详情
      .state('root.current-deposit-detail', {
        url: '/current-deposit/:number',
        data: {
          title: '零存宝'
        },
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
        url: '/project/:number',
        views: {
          '': {
            templateUrl: 'views/project/project-detail.html',
            controller: 'ProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/project-detail'
          }
        }
      })
      // 宏金保详情页更多详情
      .state('root.project-detail-more', {
        url: '/project-detail-more/:number',
        views: {
          '': {
            templateUrl: 'views/project/project-detail-more.html',
            controller: 'ProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/project-detail'
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
      // 投资确认页
      .state('root.invplan-verify', {
        url: '/invplan-verify/:number',
        views: {
          '': {
            templateUrl: 'views/project/_investment-confirmation.html',
            controller: 'InvestmentConfirmationCtrl',
            controllerUrl: 'scripts/controllers/project/investment-confirmation'
          }
        }
      })
      // 个人中心
      .state('root.userCenter', {
        abstract: true,
        url: '/user-center',
        views: {
          'user-center': {
            templateUrl: 'views/user-center/user-center.html'
              /*,
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
      .state('root.userCenter.account', {
        url: '/account',
        data: {
          title: '账户'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/account.html',
            controller: 'AccountCtrl',
            controllerUrl: 'scripts/controllers/user-center/account'
          }
        }
      })
      //个人设置
      .state('root.userCenter.setting', {
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
      .state('root.userCenter.investments-stat', {
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
      .state('root.userCenter.info', {
        url: '/info',
        data: {
          title: '基本资料'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/info.html',
            controller: 'InfoCtrl',
            controllerUrl: 'scripts/controllers/user-center/info'
          }
        }
      })
      // 我的债权
      .state('root.userCenter.credits', {
        url: '/credits',
        data: {
          title: '我的投资'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credit.html',
            controller: 'CreditCtrl',
            controllerUrl: 'scripts/controllers/user-center/credit'
          }
        }
      })
      // 我的订单
      .state('root.userCenter.orders', {
        url: '/orders',
        data: {
          title: '我的订单'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/order.html',
            controller: 'OrderCtrl',
            controllerUrl: 'scripts/controllers/user-center/order'
          }
        }
      })
      // 充值
      .state('root.userCenter.recharge', {
        url: '/recharge?amount',
        data: {
          title: '充值'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/recharge.html',
            controller: 'RechargeCtrl',
            controllerUrl: 'scripts/controllers/user-center/recharge'
          }
        }
      })
      // 提现
      .state('root.userCenter.withdraw', {
        url: '/withdraw',
        data: {
          title: '提现'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/withdraw.html',
            controller: 'WithdrawCtrl',
            controllerUrl: 'scripts/controllers/user-center/withdraw'
          }
        }
      })
      // 银行卡管理
      .state('root.userCenter.bankcard', {
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
      .state('root.userCenter.payment-collection', {
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
      .state('root.userCenter.messages', {
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
      .state('root.userCenter.deals', {
        url: '/deals',
        data: {
          title: '交易记录'
        },
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
        data: {
          title: '常见问题'
        },
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
        data: {
          title: '安全保障'
        },
        views: {
          '': {
            // templateUrl: 'views/safe.html',
            templateUrl: 'views/safe-new.html',
            controller: 'SafeCtrl',
            controllerUrl: 'scripts/controllers/safe'
          }
        }
      })
      // 宏财简介
      .state('root.about', {
        url: '/about',
        data: {
          title: '宏财介绍'
        },
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
        url: '/share-detail/:id?act&f', //f 表示渠道,act 表示活动
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
        url: '/share-home?act&f', //f 表示渠道,act 表示活动
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
        url: '/experience-activity/:number?act&c',
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
          }
        }
      })
      //推荐页
      .state('root.recommend', {
        url: '/recommend',
        views: {
          '': {
            templateUrl: 'views/recommend.html',
          }
        }
      })
      //串码活动页
      .state('root.exchange-code', {
        url: '/exchange-code',
        views: {
          '': {
            templateUrl: 'views/activity/exchange-code.html',
          }
        }
      })
      //分享朋友圈活动案例页（固定案例页）
      .state('root.share-scene-example', {
        url: '/share-scene-example?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/share-scene-example.html',
            controller: 'ShareSceneExampleCtrl',
            controllerUrl: 'scripts/controllers/share/share-scene-example-ctrl'
          }
        }
      })
      //分享朋友圈活动场景选择页
      .state('root.activity-scene', {
        url: '/activity-scene?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/activity-scene.html',
            controller: 'SceneActivityCtrl',
            controllerUrl: 'scripts/controllers/activity/scene-activity-ctrl'
          }
        }
      })
      //分享朋友圈活动生成页
      .state('root.share-scene', {
        url: '/share-scene/:sceneId?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/activity-real.html',
            controller: 'RealSceneActivityCtrl',
            controllerUrl: 'scripts/controllers/share/realscene-activity-ctrl'
          }
        }
      })

      //媒体公告
      .state('root.media-reports', {
        url: '/media-reports',
        views: {
          '': {
            templateUrl: 'views/activity/activity-real.html',
          }
        }
      })
      //网站公告
      .state('root.web-site-notice', {
        url: '/web-site-notice',
        views: {
          '': {
            templateUrl: 'views/activity/activity-real.html',
          }
        }
      })
      //宏财动态
      .state('root.hongcai-trends', {
        url: '/hongcai-trends',
        views: {
          '': {
            templateUrl: 'views/activity/activity-real.html',
          }
        }
      })

      //定义root.share-spring
      .state('root.share-spring', {
        abstract: true,
        url:'/share-spring',
        views: {
          '': {
            templateUrl: 'views/root-share.html',
            controller: 'ShareSpringCtrl',
            controllerUrl: 'scripts/controllers/share-spring/share-spring-ctrl'
          }
        }
      })
      //新年点赞活动首页
      .state('root.share-spring.home', {
        url: '/home',
        views: {
          '': {
            templateUrl: 'views/share-spring/share-spring-home.html',
            controller: 'ShareSpringHomeCtrl',
            controllerUrl: 'scripts/controllers/share-spring/share-spring-home-ctrl'
          }
        }
      })
      //新年点赞活动任务页
      .state('root.share-spring.detail', {
        url: '/detail/:id',
        views: {
          '': {
            templateUrl: 'views/share-spring/share-spring-detail.html',
            controller: 'ShareSpringDetailCtrl',
            controllerUrl: 'scripts/controllers/share-spring/share-spring-detail-ctrl'
          }
        }
      })
      //新年点赞活动自己任务页
      .state('root.share-spring.mydetail', {
        url: '/mydetail/:number',
        views: {
          '': {
            templateUrl: 'views/share-spring/share-spring-mydetail.html',
          }
        }
      })
      //新年点赞活动他人任务页
      .state('root.share-spring.otherdetail', {
        url: '/otherdetail',
        views: {
          '': {
            templateUrl: 'views/share-spring/share-spring-otherdetail.html',
          }
        }
      })
      //新年点赞活动结束页
      .state('root.share-spring.ending', {
        url: '/ending',
        views: {
          '': {
            templateUrl: 'views/share-spring/share-spring-ending.html',
          }
        }
      })
      //新年点赞活动第二关自己任务页
      .state('root.share-spring.mySecondDetail', {
        url: '/mySecondDetail',
        views: {
          '': {
            templateUrl: 'views/share-spring/_mysecond-detail.html',
          }
        }
      })
      //新年点赞活动第三关自己任务页
      .state('root.share-spring.myThirdDetail', {
        url: '/myThirdDetail',
        views: {
          '': {
            templateUrl: 'views/share-spring/_mythird-detail.html',
          }
        }
      })

      // 活动主url
      .state('root.activity', {
        abstract: true,
        url:'/activity',
        views: {
          '': {
            templateUrl: 'views/activity/root-activity.html'
            // controller: 'ShareSpringCtrl',
            // controllerUrl: 'scripts/controllers/share-spring/share-spring-ctrl'
          }
        }
      })

      // //邀请活动落地落地页
      // .state('root.activity.invite', {
      //   url: '/invite',
      //   views: {
      //     '': {
      //       templateUrl: 'views/activity/invite-landing.html',
      //       controller: 'InviteCtrl',
      //       controllerUrl: 'scripts/controllers/activity/invite-ctrl'
      //     }
      //   }
      // })

      //体验金新手标
      .state('root.experience-project-detail', {
        url: '/experience-project',
        views: {
          '': {
            templateUrl: 'views/project/experience-project-detail.html',
            controller: 'ExperienceProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/experience-project-detail'
          }
        }
      })
      //我的奖励
      .state('root.userCenter.grade', {
        url: '/grade?tab&subTab',
        views: {
          '': {
            templateUrl: 'views/user-center/grade.html',
            controller: 'GradeCtrl',
            controllerUrl: 'scripts/controllers/user-center/grade'
          }
        }
      })
      //送现金落地页
      .state('root.activity-landing', {
        url: '/activity-landing',
        views: {
          '': {
            templateUrl: 'views/activity/activity-landing.html',
          }
        }
      })


    ;
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

  }])
  .run(function($rootScope, DEFAULT_DOMAIN, $q, $timeout, $state, $location, $http, restmod, config, Restangular, URLService, Utils) {
    Restangular.setBaseUrl('/hongcai/rest');
    Restangular.setDefaultHeaders({
      'Content-Type': 'application/json'
    })

    // 不需要显示footer的path
    var notShowFooterRoute = [
      'share-home',
      'share-detail',
      'experience-landing',
      'experience-activity',
      'rate-activity',
      'exchange-code',
      'share-scene-example',
      'activity-scene',
      'share-scene',
      'share-spring',
      'grade',
      'activity-landing',
      'recommend'
    ];

    var routespermission = [
      '/user-center'
    ];

    var titleMap = {
      'issue': '常见问题',
      'about': '帮助中心',
      'safe': '安全保障',
      'account': '账户总览'
    };

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      var title = '宏财理财';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }
      $rootScope.headerTitle = title;

      $rootScope.timeout = false;
      $timeout(function() {
        $rootScope.timeout = true;
      }, 400);


      $rootScope.showFooter = false;
      if (notShowFooterRoute.indexOf($location.path().split('/')[1]) === -1) {
        $rootScope.showFooter = true;
      }

      // $rootScope.showTitle = titleMap[path];
      $rootScope.showMe = false;
      $rootScope.checkSession = $q.defer();
      var $checkSessionServer = $http.get(DEFAULT_DOMAIN + '/users/checkSession');
      $checkSessionServer.success(function(response) {

        if (response.user) { // 已经授权过，1、登录 2未注册
          $rootScope.isLogged = true;
          $rootScope.bindWechat = false;
          $rootScope.hasLoggedUser = response.user;
          $rootScope.securityStatus = response.securityStatus;
          $rootScope.account = response.account;
          $rootScope.openid = response.user.openid;
          $rootScope.nickName = response.user.nickName;
          $rootScope.headImgUrl = response.user.headImgUrl;
          $rootScope.userInfo = response.user;
          $rootScope.voucher = response.voucher;

          $rootScope.checkSession.resolve(response);
          if (!response.user.mobile && !response.user.email) {
            $rootScope.isLogged = false;
          }

          if ($rootScope.userInfo && $rootScope.userInfo.id > 0 && $rootScope.openid){
            $rootScope.bindWechat = true;
          }

          if (!$rootScope.isLogged && routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
            $location.path('/login');
            return;
          }
        } else if (response.ret === -1) { //用户未登录，。

          if (!Utils.isWeixin()) {
            $rootScope.checkSession.resolve(response);
            if(routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1){
              $state.go('root.login', {redirectUrl: encodeURIComponent($location.url())});
            }
            
            return;
          }

          var wechat_code = $location.search().code;
          var redirect_uri = location.href;
          if (wechat_code) { // 用户未登录但已经有code，去登录
            restmod.model(DEFAULT_DOMAIN + '/desireUsers/').$find(wechat_code + '/openid').$then(function(response) {
              if (response.ret == -1){
                var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid +
                  "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
                window.location.href = wechatRedirectUrl;
                return;
              }


              $rootScope.isLogged = true;
              $rootScope.bindWechat = false;
              $rootScope.hasLoggedUser = response;
              $rootScope.userInfo = response;
              $rootScope.openid = response.openid;
              $rootScope.nickName = response.nickName;
              $rootScope.headImgUrl = response.headImgUrl;

              $rootScope.checkSession.resolve(response);
              if (!response.mobile && !response.email) {
                $rootScope.isLogged = false;
              }

              if ($rootScope.userInfo && $rootScope.userInfo.id > 0 && $rootScope.openid){
                $rootScope.bindWechat = true;
              }

              if (!$rootScope.isLogged && routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
                $state.go('root.login', {redirectUrl: encodeURIComponent($location.url())});
              } else if (response.ret == -1) { // 未拿到openid再次请求授权
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
