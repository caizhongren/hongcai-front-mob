/*
* @Author: yuyang
* @Date:   2016-09-02 11:12:13
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-29 11:42:38
*/

'use strict';
angular.module('p2pSiteMobApp')
  .run(function($templateCache, $rootScope, DEFAULT_DOMAIN, $q, $timeout, $state, $location, $http, $uibModal, ipCookie, restmod, config, Restangular, URLService, Utils, SessionService) {
    // if ('addEventListener' in document) {
    // document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
    // }, false);
    // }

    Restangular.setBaseUrl(DEFAULT_DOMAIN);
    Restangular.setDefaultHeaders({
      'Content-Type': 'application/json'
    })

    var routespermission = [
      '/user-center'
    ];

    var titleMap = {
      'issue': '常见问题',
      'about': '帮助中心',
      'safe': '安全保障',
      'account': '账户总览'
    };

    /**
     * 跳转到登陆页
     */
    $rootScope.toLogin = function() {
      if (!$rootScope.timeout) {
        return;
      }
      $state.go('root.login', {
        redirectUrl: $location.path()
      });
      return;
    }
    //跳转到充值页面
    $rootScope.toRecharge = function(){
      if($rootScope.timeout){
        $state.go('root.userCenter.recharge');
      }
    }

    $rootScope.toRealNameAuth = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'views/user-center/realname-auth.html',
        controller: 'RealNameAuthCtrl'
          // size: size,
          // resolve: {
          //   items: function () {
          //     return $scope.items;
          //   }
          // }
      });
    }
    /**
     * 未支付订单
     */
    $rootScope.tofinishedOrder = function() {
      Restangular.one('orders').one('unpay').get().then(function(order) {
        if (!order || order.ret === -1) {
          return false;
        }

        $rootScope.unfinishOrderModal =
          $uibModal.open({
            templateUrl: 'views/project/unfinished-order.html',
            controller: 'UnfinishedOrderCtrl',
            resolve: {
              order: order
            }
          });
        return true;
      });
    }
    /**
     * 复制邀请链接弹窗
     */
    $rootScope.toCopyLink = function() {
      if(!$rootScope.isLogged) {
        $rootScope.toLogin();
        return;
      }
      $uibModal.open({
        animation: true,
        templateUrl: 'views/user-center/copy-link.html',
        controller: 'CopyLinkCtrl'
      });
    }

    /**
     * 激活存管通
     */
    $rootScope.payCompany = config.pay_company;
    $rootScope.toActivate = function() {
      if ($rootScope.payCompany === 'yeepay'|| !$rootScope.isLogged) {
        return;
      }
      Restangular.one('users').one('0/userAuth').get({}).then(function(userAuth){
        if(userAuth.ret !== -1 && (userAuth.authStatus !== 2 || !userAuth.active)){
          $uibModal.open({
            animation: true,
            templateUrl: 'views/user-center/activate.html',
            controller: 'ActivateCtrl'
          });
        }
      });
    } 

    /**
     * 错误提示
     */
    $rootScope.showErrorMsg = false;
    $rootScope.showMsg = function(msg) {
      $rootScope.msg = '';
      if (msg) {
        $rootScope.msg = msg;
        $rootScope.showErrorMsg = true;
        $timeout(function() {
          $rootScope.showErrorMsg = false;
        }, 2000);
      }
      if(msg == undefined) {
        $rootScope.showErrorMsg = false;
      }
    }
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      var title = '宏财网';
      if (toState.data && toState.data.title) {
        title = toState.data.title; 
      }
      $rootScope.headerTitle = title;
      
      $rootScope.timeout = false;
      $timeout(function() {
        $rootScope.timeout = true;
      }, 400);

      $rootScope.loading = true;
      $timeout(function() {
        $rootScope.loading = false;
      }, 350);



      // $rootScope.showTitle = titleMap[path];
      $rootScope.showMe = false;
      if(SessionService.isLogin()){
        var user = SessionService.getUser();
        // 已经授权过，1、登录 2未注册
        $rootScope.isLogged = true;
        $rootScope.bindWechat = false;
        $rootScope.hasLoggedUser = user;

        if (!user.mobile && !user.email) {
          $rootScope.isLogged = false;
        }

        if ($rootScope.hasLoggedUser && $rootScope.hasLoggedUser.id > 0 && $rootScope.hasLoggedUser.openid) {
          $rootScope.bindWechat = true;
        }


        if (!$rootScope.isLogged && toState.name.indexOf('root.userCenter') !== -1) {
          $location.url('/login?redirectUrl=' + encodeURIComponent($location.url()));
          return;
        }
        
      } else { //用户未登录，。
          $rootScope.isLogged = false;
          if(!ipCookie('guestId')){
            ipCookie('guestId', Utils.uuid(32,16), {
              expires: 1,
              path: '/'
            });
          }

          if (!Utils.isWeixin()) {
            if (toState.name.indexOf('root.userCenter') !== -1) {
              // $state.go('root.login', {
              //   redirectUrl: encodeURIComponent($location.url())
              // }, {notify: false});
              $location.url('/login?redirectUrl' + encodeURIComponent($location.url()));
            }
            return;
          }

          var wechat_code = $location.search().code;
          var redirect_uri = location.href;
          if (wechat_code) { // 用户未登录但已经有code，去登录
            restmod.model(DEFAULT_DOMAIN + '/users/').$find(wechat_code + '/openid').$then(function(response) {
              if (response.ret == -1) {
                var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid +
                  "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
                window.location.href = wechatRedirectUrl;
                return;
              }

              SessionService.loginSuccess(response.$response.data);

              $rootScope.isLogged = true;
              $rootScope.bindWechat = false;
              $rootScope.hasLoggedUser = response;

              if (!response.mobile && !response.email) {
                $rootScope.isLogged = false;
              }

              if ($rootScope.hasLoggedUser && $rootScope.hasLoggedUser.id > 0 && $rootScope.hasLoggedUser.openid) {
                $rootScope.bindWechat = true;
              }

              if (!$rootScope.isLogged && routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
                $state.go('root.login', {
                  redirectUrl: encodeURIComponent($location.url())
                });
              } else if (response.ret == -1) { // 未拿到openid再次请求授权
                var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid +
                  "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
                window.location.href = wechatRedirectUrl;
              } 

            });
          } else { // 未登录且还未授权

            var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.wechatAppid +
              "&redirect_uri=" + encodeURIComponent(URLService.removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
            window.location.href = wechatRedirectUrl;

          }
        }



    });


    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      clearInterval($rootScope.timer);  //清空首页公告的定时器
      var title = '宏财网';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }else if($location.url() === '/guaranteepro-list?tab=2'){
        title = '债权转让';       
      } else if ($location.url() === '/guaranteepro-list?tab=0' || $location.url() === '/guaranteepro-list') {
        title = '宏财精选'; 
      } else if ($location.url() === '/guaranteepro-list?tab=1') {
        title = '宏财尊贵'; 
      }
      
      $rootScope.headerTitle = title;
      if (toState.name !== 'root.project' || toState.name !== 'root.assignments-detail') {
        Utils.setTitle($rootScope.headerTitle);
      }

      var path = $location.path().split('/')[1];
      $rootScope.showPath = path;
      $rootScope.showTitle = titleMap[path];

      $rootScope.channelCode = $location.search().f;
      $rootScope.act = $location.search().act;
      $rootScope.channelParamsObj = {};
      
      if($location.search().appFlag === 'app'){
        $rootScope.showBack = true;
        ipCookie('appFlag', 'app', {expires: 60, path: '/'});
      } else if(ipCookie('appFlag') === 'app'){
        $rootScope.showBack = true;
      }

      for (var obj in $location.search()) {
        if (obj !== 'act' && obj !== 'f') {
          $rootScope.channelParamsObj[obj] = $location.search()[obj];
        }
      }

      $rootScope.channelParams = '';
      if (!jQuery.isEmptyObject($rootScope.channelParamsObj)) {
        $rootScope.channelParams = angular.toJson($rootScope.channelParamsObj);
      }

      if ($rootScope.channelParams) {
        ipCookie('channelParams', $rootScope.channelParams, {
          expires: 1,
          path: '/'
        });
      }

      if ($rootScope.channelCode) {
        ipCookie('utm_from', $rootScope.channelCode, {
          expires: 1,
          path: '/'
        });
      }

      if ($rootScope.act) {
        ipCookie('act', $rootScope.act, {
          expires: 1,
          path: '/'
        });
      }

      // 不需要显示footer的path
      var notShowFooterRoute = [
        'share-home',
        'share-detail',
        'assignments',
        'experience-landing',
        'experience-activity',
        'rate-activity',
        'exchange-code',
        'share-scene-example',
        'activity-scene',
        'share-scene',
        'share-spring',
        'rate-coupon',
        'project',
        'project-info',
        'project-detail',
        'activity',
        'privacy-policy',
        'assignments',
        'assignment_qr',
        'credits-overview'
      ];
      if (notShowFooterRoute.indexOf(path) === -1) {
        $rootScope.showFooter = true;
      }

      var mainPath = [
        'recommend',
        'safe',
        'about'
      ];
      var projectPath = [
        'project',
        'project-info',
        'issue',
        'novice-guide',
        'guaranteepro-list',
        'investment-status'
      ];

      var loginOrMy = [
        'login',
        'register',
        'user-center',
        'yeepay-callback',
        'modify-pwd'
      ];

      $rootScope.whichFooter = 1;
      if (mainPath.indexOf(path) !== -1) {
        $rootScope.whichFooter = 1;
      } else if (projectPath.indexOf(path) !== -1) {
        $rootScope.whichFooter = 2;
      } else if (loginOrMy.indexOf(path) !== -1) {
        $rootScope.whichFooter = 3;
      }

    });

    /*加载中loading*/
    $rootScope.showLoadingToast = false;
    $rootScope.showSuccessToast = false;
    $rootScope.successMsg = '';


  });
