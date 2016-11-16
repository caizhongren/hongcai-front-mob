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

    // 宏金保详情页
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
      // 新宏金保项目详情页
      .state('root.project', {
        url: '/project/:number',
        views: {
          '': {
            templateUrl: 'views/project/new-project-detail.html',
            controller: 'NewProjectDetailCtrl',
            controllerUrl: 'scripts/controllers/project/new-project-detail'
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
      // 宏金保列表页
      .state('root._main-list-temp', {
        url: '/guaranteepro-list?tab',
        views: {
          '': {
            templateUrl: 'views/main/_main-list-temp.html',
            controller: 'ProjectListCtrl',
            controllerUrl: 'scripts/controllers/project/project-list'
          }
        }
      })
      //债权转让列表页
      .state('root._main-list-temp0', {
        url: '/assignments',
        data: {
          title: '债权转让'
        },
        views: {
          '': {
            templateUrl: 'views/assignment/assignment-list.html',
            controller: 'ProjectListCtrl',
            controllerUrl: 'scripts/controllers/project/project-list'
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
      // 立即投资页
      // .state('root.investment-status', {
      //   url: '/investment-status/:number',
      //   views: {
      //     '': {
      //       templateUrl: 'views/project/investment-status.html',
      //       controller: 'InvestCtrl',
      //       controllerUrl: 'scripts/controllers/project/invest'
      //     }
      //   }
      // })
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
        url: '/credits/:tab',
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
      // 债权详情
      .state('root.userCenter.credit-security-details', {
        url: '/credit-security-details/:id',
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
      // .state('root.issue', {
      //   url: '/issue',
      //   data: {
      //     title: '常见问题'
      //   },
      //   views: {
      //     '': {
      //       templateUrl: 'views/issue.html',
      //       controller: 'IssueCtrl',
      //       controllerUrl: 'scripts/controllers/issue'
      //     }
      //   }
      // })
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
            templateUrl: 'views/about-new.html',
            controller: 'AboutCtrl',
            controllerUrl: 'scripts/controllers/about'
          }
        }
      })

      //推荐页
      .state('root.recommend', {
        url: '/recommend',
        views: {
          '': {
            templateUrl: 'views/activity/recommend.html',
            controller: 'DailyLotteryCtrl',
            controllerUrl: 'scripts/controllers/daily-lottery/daily-lottery-ctrl'
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
        url: '/experience-activity/:number?act&f',
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
        url: '/rate-activity?act&f',
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
        url: '/experience-landing?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/experience-landing.html',
          }
        }
      })
      //新手引导页
      .state('root.novice-guide', {
        url: '/novice-guide',
        views: {
          '': {
            templateUrl: 'views/novice-guide.html',
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
        url: '/share-spring',
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
      url: '/activity',
      views: {
        '': {
          templateUrl: 'views/activity/root-activity.html'
            // controller: 'ShareSpringCtrl',
            // controllerUrl: 'scripts/controllers/share-spring/share-spring-ctrl'
        }
      }
    })

    //投资返现落地页
    .state('root.activity.activity-landing', {
      url: '/send-money?act&f',
      views: {
        '': {
          templateUrl: 'views/activity/send-money.html',
          controller: 'SendMoneyCtrl',
          controllerUrl: 'scripts/controllers/activity/send-money-ctrl'
        }
      },
      data: {
        title: '投资送688元！奖金可立即提现！'
      }
    })

    //投资送加息券落地页
    .state('root.activity.send-coupon', {
        url: '/send-coupon?act&f',
        views: {
          '': {
            templateUrl: 'views/activity/coupon-landing.html',
            controller: 'SendCouponCtrl',
            controllerUrl: 'scripts/controllers/activity/send-coupon-ctrl'
          }
        },
        data: {
          title: '2%加息券，投资即送！'
        }
      })
      //新手活动落地页
      .state('root.activity.novice-landing', {
        url: '/novice-activity?act&f&inviteCode',
        views: {
          '': {
            templateUrl: 'views/activity/novice-landing.html',
            controller: 'NoviceCtrl',
            controllerUrl: 'scripts/controllers/activity/novice-landing-ctrl'
          }
        },
        data: {
          title: '注册立拿688元现金+3%加息券'
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
      //邀请活动
      .state('root.activity.newInvite-landing', {
        url: '/invite-activity?act&f&inviteCode',
        views: {
          '': {
            templateUrl: 'views/activity/newInvite.html',
            controller: 'newInviteCtrl',
            controllerUrl: 'scripts/controllers/activity/new-invite-ctrl'
          }
        },
        data: {
          title: '邀请好友投资送80元现金'
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
        url: '/grade?tab&subTab',
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
