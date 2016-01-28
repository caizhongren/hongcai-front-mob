'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('InvestmentConfirmationCtrl', function($scope, $state, $rootScope, $stateParams, $location, fundsProjects, Restangular, restmod, DEFAULT_DOMAIN, config) {

    var number = $stateParams.number;
    if (!number) {
      $state.go('root.main');
      return;
    }

    if(!$rootScope.isLogged){
      $state.go('root.login', {redirectUrl: $location.path()});
      return;
    }


    $scope.canUseFlag = false;
    $scope.needRecharge = false;
    $rootScope.checkSession.promise.then(function() {

      fundsProjects.$find(number).$then(function(project) {
        if(project.ret === -1){
          alert('网络异常，请稍后再试！');
          return;
        }
        $scope.project = project;
        
        $scope.canUseFlag = $scope.project.product.type !== 1;
        $scope.project.projectInvestAmount = project.currentStock * project.increaseAmount;
        $scope.project.investAmount = $rootScope.account.balance >= 100 ? Math.floor($rootScope.account.balance / 100) * 100 : 100;
        $scope.project.investAmount = $scope.project.investAmount >= $scope.project.projectInvestAmount ? $scope.project.projectInvestAmount: $scope.project.investAmount;
        $scope.project.isRepeatFlag = false;
        
        // 当status===1可融资状态的时候，判断fundsFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动投资用户。
        if ($scope.project.status === 1) {
            // 用户可投资金额
          var plusNum = $rootScope.securityStatus.realNameAuthStatus + $rootScope.securityStatus.autoTransfer;
          switch (plusNum) {
            case 2:
              $scope.fundsFlag = 3;
              break;
            case 1:
              $scope.fundsFlag = 2;
              break;
            case 0:
              $scope.fundsFlag = 1;
              break;
          }
        }

        if (!$rootScope.isLogged) {
          $state.go('root.login', {redirectUrl: $location.path()});
          return;
        }
        /**
         * 加息券统计信息
         */
        Restangular.one('users', $rootScope.hasLoggedUser.id).one('unUsedIncreaseRateCoupons').get().then(function(response) {
          $scope.increaseRateCoupons = response;
          $scope.selectCoupon = null;
          if ($scope.increaseRateCoupons.length > 0 && $scope.project.product.type !== 1) {
            for (var i = 0; i < $scope.increaseRateCoupons.length; i++) {
              var rateText = '加息券 +' + $scope.increaseRateCoupons[i].rate + '%';
              $scope.increaseRateCoupons[i].rateText = rateText;
            }
            var increaseRateCoupon = {
              number: "",
              rate: 0,
              rateText: "不使用加息券"
            }
            $scope.increaseRateCoupons.push(increaseRateCoupon);

            $scope.selectCoupon = $scope.increaseRateCoupons[0];
          }
        });
      });

    });

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

    /**
     * 点击使用奖励
     */
    $scope.rewardFlag = false;
    $scope.selectReward = function(project){
      if(project.investAmount <= 0){
        alert('请先输入投资金额');
        return;
      }
      $scope.rewardFlag = $scope.selectCoupon != null;
    }

    $scope.$watch('project.isRepeatFlag', function(newVal, oldVal){
      if($scope.project){
        // alert($scope.project.isRepeatFlag);
      }
      
      
    })

    /**
     * 确认使用奖励
     * @type {Number}
     */
    $scope.confirmUseReward = function(project, selectCoupon){
      $scope.couponNumber = selectCoupon == null ? "" : selectCoupon.number;
      $scope.rewardFlag = false;
      $scope.selectCoupon = selectCoupon;
    }

    $scope.toInvest = function(project) {
      if (project.isRepeatFlag && $scope.fundsFlag === 3) {
        $scope.isRepeat = 1;
      } else {
        $scope.isRepeat = 2;
      }

      if (!project.investAmount) {
        $scope.msg = '投资金额有误，请重新输入';
        return;
      }

      if ($scope.fundsFlag === 0) {
        $state.go('root.login', {redirectUrl: $location.path()});
      } else if ($scope.fundsFlag === 1) {
        // 需要跳到实名认证页面
      } else if ($scope.checkLargeUserCanAmount(project)) {
        $state.go('root.userCenter.recharge');
      } else if ($scope.fundsFlag === 2 || $scope.fundsFlag === 3) {
          restmod.model(DEFAULT_DOMAIN + '/fundsProjects/' + number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
            amount: project.investAmount,
            projectId: project.id,
            isRepeat: $scope.isRepeat,
            payAmount: project.investAmount,
            couponNumber: $scope.couponNumber
          }).$then(function(response) {

            if(response.$status !== 'ok'){
              $scope.msg = "服务器累瘫了，请稍后访问。";
              return;
            } else if(response.ret === -1){
              $scope.msg = response.msg;
              return;
            }

            $state.go('root.yeepay-transfer', {
              type: 'transfer',
              number: response.number
            });
          })
      }
    };

    $scope.checkLargeUserCanAmount = function(project) {
      if(!$rootScope.account || !project){
        $scope.needRecharge = false;
        return false;
      }

      $scope.needRecharge =  $rootScope.account.balance < project.investAmount
      return  $scope.needRecharge;       
    };

    $scope.checkStepAmount = function(project) {
      return project.investAmount % project.increaseAmount !== 0;
    };

    $scope.checkAutoTransfer = function(project) {

      if ($scope.fundsFlag !== 3) {
        $scope.project.isRepeatFlag = false;
        project.isRepeatFlag = false;
        $scope.authAutoTransferFlag = true;
        $scope.msg = "您还没有开通自动续投";
      }
    };

    $scope.cancelAuthAutoTransfer = function() {
      $scope.authAutoTransferFlag = false;
    }

    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      $state.go('root.yeepay-transfer', {
        type: 'autoTransfer',
        number: "null"
      });
    }


  });
