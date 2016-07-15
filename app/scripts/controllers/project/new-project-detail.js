'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:NewProjectDetailCtrl
 * @description
 * # NewProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('NewProjectDetailCtrl', function($scope,$timeout, $state, $rootScope, $stateParams, $location, fundsProjects,$interval, Restangular, restmod, DEFAULT_DOMAIN, config, projectStatusMap,DateUtils) {
    // 项目详情页面
    var number = $stateParams.number;
    if (!$stateParams.number) {
      $state.go('root.main');
    }
    $scope.profit = 0;
    $scope.increaseRateProfit = 0;
    $scope.projectStatusMap = projectStatusMap;
    $scope.unSelectCouponMsg = '暂无可用加息券';
    $scope.initLimit = 3;
    $scope.resetInitLimit = function(){
        $scope.initLimit = 3;
    }
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $scope.project = response;
      $rootScope.increaseAmount = $scope.project.increaseAmount;
      $scope.project.investAmount = 1000;
      $scope.jigoubaoDataMore = $scope.project.projectInfo;
      if($scope.project.status === 7){
        $scope.showUnfinishedOrder();
      }
      //已投百分百
      $scope.perence = (response.soldStock + response.occupancyStock) * response.increaseAmount / response.total * 100;
      
      // 可投资金额
      $scope.availableAmount = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
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
    
      $scope.increaseRateCoupons = [];
      Restangular.one('projects').one('investIncreaseRateCoupon').get({
        projectId : $scope.project.id,
        amount : $scope.availableAmount
      }).then(function(response) {
        $scope.increaseRateCoupons = response;
        $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[0];
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

    $scope.toInvest = function(project) {
      $scope.showMsg(project.investAmount);
      if($scope.showErrorMsg){
        return;
      }

      $scope.investAmount = project.investAmount;
      var payAmount = $scope.investAmount;
      var couponNumber = $scope.selectIncreaseRateCoupon != null ? $scope.selectIncreaseRateCoupon.number : '';
      if ($scope.fundsFlag === 0) {
        // $state.go('root.login', {
        //   redirectUrl: $location.path()
        // });
      } else if ($scope.fundsFlag === 1) {
        // 需要跳到实名认证页面
      } else if ($scope.checkLargeUserCanAmount(project)) {
        $state.go('root.userCenter.recharge');
      } else if ($scope.fundsFlag === 2) {
        if (payAmount > 0) {
          restmod.model(DEFAULT_DOMAIN + '/projects/' + number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
            // fundsProjects.$find(number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
            investAmount: project.investAmount,
            couponNumber: couponNumber
          }).$then(function(order) {
            // 重复下单后，response.number为undefined
            if (order.ret !== -1) {
              if (order.number !== null && order.number !== undefined) {
                $state.go('root.yeepay-transfer', {
                  type: 'transfer',
                  number: order.number
               });
              } else if (response.ret === -1) {
                $scope.msg = response.msg;
                $scope.showMsg(payAmount);
              }
            } else {
              $scope.msg = order.msg;
              $scope.showMsg(payAmount);
              // $rootScope.tofinishedOrder($scope.order);
            }
          })
        }
      }
    };

    
    $scope.showErrorMsg = false;
    $scope.investButtonFlag = true;
    $scope.$watch('project.investAmount', function(newVal, oldVal){
      if(!$rootScope.isLogged){
        return;
      }

      $scope.showErrorMsg = false;

      if(newVal !== oldVal){
        $scope.msg = undefined;
      }

      if($rootScope.account.balance <= 0){
        $scope.msg = '账户余额不足，请先充值';
      }

      if(newVal){
        if(newVal > $scope.availableAmount){
          $scope.msg = '投资金额必须小于' + $scope.availableAmount;
        }else if(newVal > $rootScope.account.balance){
          $scope.msg = '账户余额不足，请先充值';
        } else if(newVal % $rootScope.increaseAmount){
          $scope.msg = '投资金额必须为' + $rootScope.increaseAmount + '的整数倍';
          
        }
      }

      if($scope.project){
         $scope.profit = $scope.calcProfit($scope.project.annualEarnings) || 0;
         $scope.increaseRateProfit = $scope.selectIncreaseRateCoupon != null ? $scope.calcProfit($scope.selectIncreaseRateCoupon.rate) : 0;
      }

      $scope.showMsg(newVal);
    });

    $scope.showMsg = function(investAmount){
      if($scope.msg){
        $scope.showErrorMsg = true;
        $scope.investButtonFlag = false;
        $timeout(function() {
          $scope.showErrorMsg = false;
        }, 3000);
      }else{
        if(investAmount){
            $scope.investButtonFlag = true;
        }
      }
    }

    $scope.showSelectIncreaseRateCoupon = false;
    $scope.selectCoupon = function(coupon){
        $scope.selectIncreaseRateCoupon = coupon;
        $scope.showSelectIncreaseRateCoupon = false;
        $scope.increaseRateProfit = $scope.calcProfit(coupon.rate);
        $scope.resetInitLimit();
    }

    $scope.unUseIncreaseRateCoupon = function(){
        $scope.selectIncreaseRateCoupon = null;
        $scope.showSelectIncreaseRateCoupon = false;
        $scope.increaseRateProfit = 0;
        $scope.resetInitLimit();
        $scope.unSelectCouponMsg = '不使用加息券';
    }

    //跳转到充值页面
    $scope.toRecharge = function(){
      $state.go('root.userCenter.recharge');
    }

    //计算预计收益
    $scope.calcProfit = function(annualEarnings){
        var profit = $scope.project.investAmount * $scope.project.projectDays * annualEarnings / 36500 ;
        return profit;
    }

    //输入框两侧加减号
    $scope.subMoney = function() {
      var oldValue = $scope.project.investAmount;
      oldValue = oldValue - 100;
      if(oldValue <= 100){
        oldValue = 100;
      }
      $scope.project.investAmount = oldValue;
    }

    $scope.plusMoney = function() {
      var oldValue = $scope.project.investAmount;
      if(!oldValue){
        oldValue = 0;
      }
      oldValue = oldValue + 100;
      $scope.project.investAmount = oldValue;
    }
});
