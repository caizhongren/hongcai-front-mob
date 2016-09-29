/*
* @Author: yuyang
* @Date:   2016-09-02 11:12:13
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-29 10:21:27
*/

'use strict';
angular.module('p2pSiteMobApp')
  .run(function($templateCache, $rootScope, DEFAULT_DOMAIN, $q, $timeout, $state, $location, $http, $uibModal, ipCookie, restmod, config, Restangular, URLService, Utils) {
    // if ('addEventListener' in document) {
    // document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
    // }, false);
    // }

    Restangular.setBaseUrl('/hongcai/rest');
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
      if ($rootScope.payCompany === 'yeepay'||!$rootScope.isLogged || $rootScope.securityStatus.realNameAuthStatus !== 1 || $rootScope.securityStatus.userAuth.active === true) {
        return;
      }
      $uibModal.open({
        animation: true,
        templateUrl: 'views/user-center/activate.html',
        controller: 'ActivateCtrl'
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
    }

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

      $rootScope.loading = true;
      $timeout(function() {
        $rootScope.loading = false;
      }, 350);



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

          if ($rootScope.userInfo && $rootScope.userInfo.id > 0 && $rootScope.openid) {
            $rootScope.bindWechat = true;
          }

          if (!$rootScope.isLogged && routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
            $location.path('/login');
            return;
          }
        } else if (response.ret === -1) { //用户未登录，。
          if (!Utils.isWeixin()) {
            $rootScope.checkSession.resolve(response);
            if (routespermission.indexOf('/' + $location.path().split('/')[1]) !== -1) {
              $state.go('root.login', {
                redirectUrl: encodeURIComponent($location.url())
              });
            }

            return;
          }

          var wechat_code = $location.search().code;
          var redirect_uri = location.href;
          if (wechat_code) { // 用户未登录但已经有code，去登录
            restmod.model(DEFAULT_DOMAIN + '/desireUsers/').$find(wechat_code + '/openid').$then(function(response) {
              if (response.ret == -1) {
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

              if ($rootScope.userInfo && $rootScope.userInfo.id > 0 && $rootScope.openid) {
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
      });
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      var title = '宏财理财';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }
      $rootScope.headerTitle = title;
      if (toState.name !== 'root.project') {
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


      if (path == 'user-center') {
        $rootScope.toActivate();
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
        'experience-landing',
        'experience-activity',
        'rate-activity',
        'exchange-code',
        'share-scene-example',
        'activity-scene',
        'share-scene',
        'share-spring',
        'grade',
        'project',
        'project-info',
        'project-detail',
        'activity'
      ];
      $rootScope.showFooter = false;
      if (notShowFooterRoute.indexOf(path) === -1) {
        $rootScope.showFooter = true;
      }

      var mainPath = [
        'recommend',
        'safe',
        'about'
      ];
      var projectPath = [
        'issue',
        'novice-guide',
        'guaranteepro-list',
        'investment-status'
      ];

      var loginOrMy = [
        'login',
        'register',
        'user-center',
        'yeepay-callback'
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
  })
