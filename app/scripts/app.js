'use strict';
/**
 * @ngdoc overview
 * @name p2pSiteMobApp
 * @description
 * # p2pSiteMobApp
 * Main module of the application.
 */
var p2pSiteMobApp = angular.module('p2pSiteMobApp', [
  // 'angular-loading-bar',
  // 'ngCookies',
  // 'angular-cache',
  // 'angular-datepicker',
  'ngAnimate',
  // 'ngTouch',
  'famous.angular',
  'ui.router',
  'restmod',
  'config',
  'ipCookie',
  // 'angularMoment',
  'infinite-scroll',
  'angular-md5',
  'restangular',
  'ui.bootstrap',
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
      //隐私条款
      .state('root.privacy-policy ', {
        url: '/privacy-policy',
        views: {
          '': {
            templateUrl: 'views/privacy-policy.html',
            // controller: 'MainCtrl',
            // controllerUrl: 'scripts/controllers/main'
          }
        }
      })
    // 开通存管通落地页
    .state('root.activate-landing', {
        url: '/activate',
        views: {
          '': {
            templateUrl: 'views/activate-landing.html',
            controller: 'ActivateCtrl',
            controllerUrl: 'scripts/modal/activate'
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
            templateUrl: 'views/login-new.html',
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
            templateUrl: 'views/register-new.html',
            controller: 'RegisterCtrl',
            controllerUrl: 'scripts/controllers/register'
          }
        }
      })
      .state('root.register2', {
        url: '/register?inviteCode',
        data: {
          title: '注册'
        },
        views: {
          '': {
            templateUrl: 'views/register-new.html',
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
        url: '/yeepay-callback/:business/:status?amount&number',
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
      //修改密码
      .state('root.modifyPwd', {
        url: '/modify-pwd',
        views: {
          '': {
            templateUrl: 'views/modify-pwd.html',
            controller: 'modifyPwd',
            controllerUrl: 'scripts/controllers/modify-pwd.js'
          }
        }
      })

    // 项目详情页
    .state('root.project-detail', {
        url: '/project-info/:number',
        views: {
          '': {
            templateUrl: 'views/project/project-detail.html',
            controller: 'ProjectInfoCtrl',
            controllerUrl: 'scripts/controllers/project/project-info'
          }
        }
      })
      // 新项目项目详情页
      .state('root.project', {
        url: '/project/:number',
        views: {
          '': {
            templateUrl: 'views/project/new-project-detail.html',
            controller: 'ProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/project-detail'
          }
        }
      })
      // 项目投资人记录页
      .state('root.orders', {
        url: '/project/:number/orders',
        views: {
          '': {
            templateUrl: 'views/project/new-orders.html',
            controller: 'NewOrdersCtrl',
            controllerUrl: 'scripts/controllers/project/new-orders'
          }
        },
        data: {
          title: '项目投资人'
        },
      })
      // 项目列表页
      .state('root.project-list', {
        url: '/guaranteepro-list?tab',
        views: {
          '': {
            templateUrl: 'views/main/project-list.html',
            controller: 'ProjectListCtrl',
            controllerUrl: 'scripts/controllers/project/project-list'
          }
        }
      })

      /**
       * 债权转让项目详情页
       */
      .state('root.assignments-detail', {
        url: '/assignments/:number',
        views: {
          '': {
            templateUrl: 'views/assignment/assignments-detail.html',
            controller: 'AssignmentDetailCtrl',
            controllerUrl: 'scripts/controller/assignment/assignment-detail-ctrl'
          }
        }
      })
      // 债权转让记录页
      .state('root.assignmentOrders', {
        url: '/assignments/:number/orders',
        views: {
          '': {
            templateUrl: 'views/assignment/assignment-orders.html',
            controller: 'assignmentOrdersCtrl',
            controllerUrl: 'scripts/controllers/assignment/assignment-orders'
          }
        },
        data: {
          title: '债权转让记录'
        }
      })
      //常见问题
      .state('root.assignment_qr', {
        url: '/assignment_qr',
        views: {
          '': {
            templateUrl: 'views/help-center/assignment_qr.html',
            controller: 'HelpCenterCtrl',
            controllerUrl: 'scripts/controller/help-center/help-center-ctrl'
          }
        },data: {
          title: '常见问题'
        }
      })
      // 项目详情页更多详情
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
      .state('root.userCenter.account-overview', {
        url: '/account-overview',
        data: {
          title: '个人中心'
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
        data: {
          title: '个人设置'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/setting.html',
            controller: 'SettingsCtrl',
            controllerUrl: 'scripts/controllers/user-center/settings'
          }
        }
      })

      // 新自动投标
      .state('root.userCenter.autotender', {
        url: '/autotender',
        data: {
          title: '自动投标'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/autotender.html',
            controller: 'AutoTenderCtrl',
            controllerUrl: 'scripts/controllers/user-center/autotender'
          }
        }
      })

      //修改手机号码
      .state('root.userCenter.resetMobile', {
        url: '/reset-mobile',
        data: {
          title: '修改手机号'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/reset-mobile.html',
            controller: 'resetMobileCtrl',
            controllerUrl: 'scripts/controllers/user-center/resetMobile'
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
       // 我的投资总览
      .state('root.userCenter.credits-overview', {
        url: '/credits-overview',
        data: {
          title: '我的投资'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credits-overview.html',
            controller: 'CreditsOverviewCtrl',
            controllerUrl: 'scripts/controllers/user-center/credits-overview'
          }
        }
      })
      // 我的投资列表
      .state('root.userCenter.credits', {
        url: '/credit?tab',
        data: {
          title: ''
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credit.html',
            controller: 'CreditCtrl',
            controllerUrl: 'scripts/controllers/user-center/credit'
          }
        }
      })
      // 债权管理
      .state('root.userCenter.assignments', {
        url: '/assignments?tab',
        data: {
          title: '债权转让'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/assignments.html',
            controller: 'assignmentsCtrl',
            controllerUrl: 'scripts/controllers/user-center/assignments-ctrl'
          }
        }
      })
      // 债权转让列表业详情
      .state('root.userCenter.assignmentList-details', {
        url: '/assignmentList-details/:number',
        data: {
          title: '转让详情'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/assignmentList-details.html',
            controller: 'assignmentListDetailsCtrl',
            controllerUrl: 'scripts/controllers/user-center/assignmentList-details-ctrl'
          }
        }
      })
      /**
       * 债权管理-债权转让页面
       */
      .state('root.userCenter.assignments-transfer-details', {
        url: '/assignments-transfer-details/:number',
        views: {
          '': {
            templateUrl: 'views/user-center/assignments-transfer-details.html',
            controller: 'AssignmentsTransferCtrl',
            controllerUrl: 'scripts/controller/user-center/assignments-transfer-details.js'
          }
        },
        data: {
          title: '立即转出'
        }
      })
      // 债权详情
      .state('root.userCenter.credit-security-details', {
        url: '/credit-security-details/:type/:number',
        data: {
          title: '债权详情'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/credit-security-details.html',
            controller: 'CreditSecurityCtrl',
            controllerUrl: 'scripts/controllers/user-center/credit-security-details'
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
        data: {
          title: '我的银行卡'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/bankcard.html',
            controller: 'BankcardCtrl',
            controllerUrl: 'scripts/controllers/user-center/bankcard'
          }
        }
      })
      // 站内消息
      .state('root.userCenter.messages', {
        url: '/messages',
        data: {
          title: '消息'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/message.html',
            controller: 'MessageCtrl',
            controllerUrl: 'scripts/controllers/user-center/message'
          }
        }
      })
      // 站内消息 公告详情
      .state('root.userCenter.web-site-notice', {
        url: '/messages/:id',
        data: {
          title: '公告详情'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/web-site-notice.html',
            controller: 'MessageDetailCtrl',
            controllerUrl: 'scripts/controllers/user-center/web-site-notice'
          }
        }
      })
      // 交易记录
      .state('root.userCenter.deals', {
        url: '/deals',
        data: {
          title: '资金流水'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/deal.html',
            controller: 'DealCtrl',
            controllerUrl: 'scripts/controllers/user-center/deal'
          }
        }
      })
      // 风险测评
      .state('root.userCenter.questionnaire', {
        url: '/questionnaire',
        data: {
          title: '风险测评'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/questionnaire.html',
            controller: 'QuestionnaireCtrl',
            controllerUrl: 'scripts/controllers/user-center/questionnaire'
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
      // 安全保障
      .state('root.safe', {
        url: '/safe',
        data: {
          title: '安全保障'
        },
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
        url: '/about/:tab',
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

   
    //体验金活动页
    .state('root.experience-activity', {
        url: '/experience-activity/:number?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/experience-activity.html',
            controller: 'ExperienceActivityCtrl',
            controllerUrl: 'scripts/controllers/activity/experience-activity-ctrl'
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

   

    // 活动主url
    .state('root.activity', {
      abstract: true,
      url: '/activity',
      views: {
        '': {
          templateUrl: 'views/activity/root-activity.html'
            // controller: 'ShareSpringCtrl',
            // controllerUrl: 'scripts/controllers/share-spring/share-spring-ctrl'
        }
      }
    })
    // 邀请活动
    .state('root.activity.invite-activity', {
      url: '/invite-activity',
      views: {
        '': {
          templateUrl: 'views/activity/new-year-invite.html',
          controller: 'newInviteCtrl',
          controllerUrl: 'scripts/controllers/activity/new-invite-ctrl'
        }
      },
      data: {
        title: '邀请好友，双重奖励'
      }
    })
    //新手活动落地页
      .state('root.activity.novice-landing', {
        url: '/novice-activity?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/new-year-novice-landing.html',
            controller: 'NewYearNoviceCtrl',
            controllerUrl: 'scripts/controllers/activity/new-year-novice-ctrl'
          }
        },
        data: {
          title: '宏运当头，财源滚滚'
        }
      })
    //体验金新手标
    .state('root.experience-project-detail', {
        url: '/experience-project',
        data: {
          title: '体验金专享标'
        },
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
        url: '/rate-coupon?tab&subTab',
        views: {
          '': {
            templateUrl: 'views/user-center/grade.html',
            controller: 'GradeCtrl',
            controllerUrl: 'scripts/controllers/user-center/grade'
          }
        }
      })
      //我的邀请
      .state('root.userCenter.invite-rebate', {
        url: '/invite-rebate',
        views: {
          '': {
            templateUrl: 'views/user-center/invite-rebate.html',
            controller: 'InviteRebateCtrl',
            controllerUrl: 'scripts/controller/user-center/invite-rebate'
          }
        }
      })
      //个人中心体验金详情页
      .state('root.userCenter.experience-money', {
        url: '/experience-money',
        data: {
          title: '我的体验金'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/experience-money.html',
            controller: 'ExperienceMoneyCtrl',
            controllerUrl: 'scripts/controllers/user-center/experience-money'
          }
        }
      })
      //个人中心我的奖金
      .state('root.userCenter.cash-coupon', {
        url: '/cash-coupon',
        data: {
          title: '我的奖金'
        },
        views: {
          '': {
            templateUrl: 'views/user-center/cash-coupon.html',
            controller: 'CashCouponCtrl',
            controllerUrl: 'scripts/controllers/user-center/cash-coupon'
          }
        }
      })

      //活动中心
      .state('root.activityCenter', {
        url: '/activity-center',
        data: {
          title: '活动中心'
        },
        views: {
          '': {
            templateUrl: 'views/activity-center.html',
            controller: 'ActivityCenter',
            controllerUrl: 'scripts/controllers/activity-center'
          }
        }
      })


    ;
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');

  }])

.constant('DEFAULT_DOMAIN', '/hongcai/rest')

.constant('WEB_DEFAULT_DOMAIN', '/hongcai/api/v1')
.constant('projectStatusMap', {
    "6": "预发布",
    "7": "融资中",
    "8": "融资成功",
    "9": "还款中",
    "10": "还款完成",
    "11": "预约中",
    "12": "预约处理异常"
});
