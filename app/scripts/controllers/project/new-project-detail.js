'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:NewProjectDetailCtrl
 * @description
 * # NewProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('NewProjectDetailCtrl', function($scope, $state, $rootScope, $stateParams, $location, fundsProjects,$interval, Restangular, restmod, DEFAULT_DOMAIN, config, projectStatusMap,DateUtils) {
    // 项目详情页面
    // var number = $stateParams.number;
    // if (!$stateParams.number) {
    //   $state.go('root.main');
    // }

    $scope.projectStatusMap = projectStatusMap;


    $scope.repaymentTypeMap = {'1': '按月付息 到期还本', '2': '按月返还 等额本息', '3': '按季付息 到期还本', '4': '半年付息 到期还本', '5': '到期还本付息'};
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $scope.project = response;
      $scope.serverTime = response.createTime || (new Date().getTime());
      $scope.project.countdown = new Date(response.releaseStartTime).getTime() - $scope.serverTime;
      $scope.project._timeDown = DateUtils.toHourMinSeconds($scope.project.countdown);
      $scope.jigoubaoDataMore = $scope.project.projectInfo;
      if($scope.project.status === 7){
        $scope.showUnfinishedOrder();
      }

      // 可投资金额
      $scope.jigoubaoProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
      // 当status===1可融资状态的时候，判断fundsFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动投资用户。
      $rootScope.checkSession.promise.then(function() {
        if ($rootScope.isLogged) {
          // 用户可投资金额
          var plusNum = $rootScope.securityStatus.realNameAuthStatus;

          switch (plusNum) {
            case 1:
              $scope.fundsFlag = 2;
              break;
            case 0:
              $scope.fundsFlag = 1;
              break;
          }
        } else {
          $scope.userCanCreditInvestNum = 0;
          $scope.fundsFlag = 0;
        }
        if (!$rootScope.hasLoggedUser || !$rootScope.hasLoggedUser.id) {
          return;
        }
      });
    });

    $interval(function() {
        $scope.project.countdown -= 1000;
        if ($scope.project.countdown <= 0 && $scope.project.status === 6) {
          $scope.project.status = 7;
        }
        $scope.project._timeDown = DateUtils.toHourMinSeconds($scope.project.countdown);
    }, 1000);

/*显示未支付订单*/
    $scope.showUnfinishedOrder = function(){
      Restangular.one('orders').one('unpay').get().then(function(response) {
        $scope.order = response;
        if(response && response.ret === -1){
            return;
        }
        if(response){
          $rootScope.tofinishedOrder($scope.order);
        }
      });
    }

    $scope.goMoreDetail = function(project) {
      $state.go('root.project-detail-more', {
        number: project.number
      });
    }
    $scope.checkLargeUserCanAmount = function(project) {
      return $rootScope.isLogged && $rootScope.account.balance < project.investAmount;
    };

    $scope.checkStepAmount = function(project) {
      if (project.investAmount >= project.increaseAmount) {
        if (project.investAmount % project.increaseAmount === 0) {
          return false;
        } else {
          return true;
        }
      }
    };


    $scope.experienceAmount = 0;
    $scope.confirmUseReward = function(project, selectCoupon) {
      if (project.useExperience) {
        $scope.experienceAmount = parseInt($rootScope.account.experienceAmount / 100) * 100;
        if ($scope.experienceAmount > project.investAmount) {
          project.investAmount = $scope.experienceAmount;
        }
      }
      $scope.couponNumber = selectCoupon == null ? "" : selectCoupon.number;
      $scope.rewardFlag = false;
      $scope.selectCoupon = selectCoupon;
    }

    function newForm() {
      var f = document.createElement('form');
      document.body.appendChild(f);
      f.method = 'post';
      // f.target = '_blank';
      return f;
    }

    function createElements(eForm, eName, eValue) {
      var e = document.createElement('input');
      eForm.appendChild(e);
      e.type = 'text';
      e.name = eName;
      if (!document.all) {
        e.style.display = 'none';
      } else {
        e.style.display = 'block';
        e.style.width = '0px';
        e.style.height = '0px';
      }
      e.value = eValue;
      return e;
    }
    $scope.toLog = function() {
      var redirectUrl = $location.path();
      $state.go('root.login', {
        redirectUrl: redirectUrl

      });

      return;
      // var locationUrl = $location.path();
      //  window.location.href = locationUrl;

    }


    /**
     * 跳转到充值页面
     */
    $scope.toRecharge = function(){
      $state.go('root.userCenter.recharge');
    }


    $scope.toInvest = function(project) {
      // console.log(project);
      if (!project.investAmount) {
        $scope.msg = '请输入投资金额';
        return;
      } else if(project.investAmount < project.minInvest){
        $scope.msg = '投资金额必须大于' + project.minInvest;
        return;
      } else if(project.investAmount % project.increaseAmount){
        $scope.msg = '投资金额必须为' + project.increaseAmount + '的整数倍';
        return;
      }

      $scope.investAmount = project.investAmount;
      var payAmount = $scope.investAmount - $scope.experienceAmount;
      var couponNumber = $scope.couponNumber;
      if ($scope.fundsFlag === 0) {
        // $state.go('root.login', {
        //   redirectUrl: $location.path()
        // });
      } else if ($scope.fundsFlag === 1) {
        // 需要跳到实名认证页面
      } else if ($scope.checkLargeUserCanAmount(project)) {
        // $state.go('root.yeepay-transfer', {
        //       type: 'recharge',
        //       number: payAmount - $rootScope.account.balance + ($rootScope.account.reward == null ? 0 : $rootScope.account.reward)
        // });
        $state.go('root.userCenter.recharge');
      } else if ($scope.fundsFlag === 2) {
        // how to bulid investment path restmod.model
        // restmod.model(DEFAULT_DOMAIN + '/projects')
        if (payAmount > 0) {
          restmod.model(DEFAULT_DOMAIN + '/projects/' + number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
            // fundsProjects.$find(number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
            investAmount: project.investAmount
          }).$then(function(order) {
            // 重复下单后，response.number为undefined
            if (order.ret !== -1) {
              if (order.number !== null && order.number !== undefined) {
                restmod.model(DEFAULT_DOMAIN + '/projects/' + number + '/users/' + $rootScope.hasLoggedUser.id + '/payment').$create({
                  orderNumber: order.number
                }).$then(function(response) {
                  if (response.$status === 'ok') {
                    var req = response.req;
                    var sign = response.sign;
                    var _f = newForm(); //创建一个form表单
                    createElements(_f, 'req', req); //创建form中的input对象
                    createElements(_f, 'sign', sign);
                    _f.action = config.YEEPAY_ADDRESS + 'toTransfer'; //form提交地址
                    _f.submit(); //提交
                  }
                  // $state.go('');
                })
              } else if (response.ret === -1) {
                $scope.msg = response.msg;
              }
          } else {
              $scope.msg = order.msg;
            }
          })
        }
      }
    };

    $scope.goToInvestVerify = function(){
      $state.go('root.investment-status', {number: $scope.project.number});
    }
});
