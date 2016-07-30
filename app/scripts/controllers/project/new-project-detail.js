'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:NewProjectDetailCtrl
 * @description
 * # NewProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('NewProjectDetailCtrl', function(ipCookie, $scope, $timeout, $state, $rootScope, $stateParams, $location,$interval, Restangular, projectStatusMap, ProjectUtils, Utils) {
    // 项目详情页面
    var number = $stateParams.number;
    if (!$stateParams.number) {
      $state.go('root.main');
    }
    $scope.profit = 0;
    $scope.increaseRateProfit = 0;
    $scope.projectStatusMap = projectStatusMap;
    $scope.unSelectCouponMsg = '暂无可用奖励';
    $scope.initLimit = 3;
    $scope.resetInitLimit = function(){
        $scope.initLimit = 3;
    }

    /**
     * 项目信息
     */
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $rootScope.headerTitle = response.name;
      Utils.setTitle($rootScope.headerTitle);

      var project = response;
      $scope.project = project;
      project.percent = (project.soldStock + project.occupancyStock) * project.increaseAmount / project.total * 100;
      project.availableAmount = project.total - (project.soldStock + project.occupancyStock) * project.increaseAmount;

      ProjectUtils.projectTimedown(project, project.createTime);


      /**
       * 新手标判断
       */
      if($scope.project.category.code === '0112'){
          Restangular.one('projects').one('investNewbieBiaoProjectVerify').get({
            number: $stateParams.number
          }).then(function(response) {
            if(response.ret === -1){
              return;
            }
            if(!response.isOk){
              $scope.msg = '仅限首次投资后一周内参与';
              $scope.showMsg();
            }
        });

      }

      /**
       * 可用券
       */
      $scope.increaseRateCoupons = [];
      Restangular.one('projects').one('investIncreaseRateCoupon').get({
        projectId : $scope.project.id,
        amount : project.availableAmount
      }).then(function(response) {
        $scope.increaseRateCoupons = response;
        $scope.selectIncreaseRateCoupon = $scope.cashType ===1 ? $scope.increaseRateCoupons[1] : $scope.increaseRateCoupons[0];
        $scope.selectIncreaseRateCoupon = $scope.rateType ===1 ? $scope.increaseRateCoupons[1] : $scope.increaseRateCoupons[0];
        $scope.project.investAmount =  1000 ;
      });

    });

    $rootScope.tofinishedOrder();

    /**
     * 下单并支付
     */
    $scope.toInvest = function(project) {

      if($scope.msg || project.investAmount < project.minInvest){
        return;
      }

      $scope.showMsg();
      $rootScope.tofinishedOrder();
      var couponNumber = $scope.selectIncreaseRateCoupon != null ? $scope.selectIncreaseRateCoupon.number : '';

      Restangular.one('projects').one(number+'/users/' + $rootScope.hasLoggedUser.id).post('investment', {
        investAmount: project.investAmount,
        couponNumber: couponNumber,
        device: Utils.deviceCode
      }).then(function(order){
        // 重复下单后，response.number为undefined
        if (order && order.ret !== -1) {
          $state.go('root.yeepay-transfer', {
            type: 'transfer',
            number: order.number
         });
        } else {
          $scope.msg = order.msg;
          // $scope.showMsg();
        }
      });
    };


    $scope.showErrorMsg = false;
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
        } else if(newVal % $scope.project.increaseAmount){
          $scope.msg = '投资金额必须为' + $scope.project.increaseAmount + '的整数倍';
        }
        $scope.showCashMsg(newVal);
      }

      if($scope.project){
        $scope.profit = $scope.calcProfit($scope.project.annualEarnings) || 0;
        if($scope.selectIncreaseRateCoupon.type ===1){
          $scope.increaseRateProfit = $scope.selectIncreaseRateCoupon != null ? $scope.calcProfit($scope.selectIncreaseRateCoupon.value) : 0;
        } else{
          $scope.cashProfit = $scope.project.investAmount >= $scope.selectIncreaseRateCoupon.minInvestAmount ? $scope.selectIncreaseRateCoupon.value : 0;
        }
      }

      $scope.showMsg();
    });

    // 判断现金券投资金额显示错误提示
    $scope.showCashMsg = function(investAmount){
      if(investAmount < $scope.selectIncreaseRateCoupon.minInvestAmount){
        $scope.msg = '投资金额不满足返现条件';
        $scope.showMsg();
      }
      return;
    }

    //显示信息
    $scope.showMsg = function(){
      if($scope.msg && $scope.project.status == 7){
        $scope.showErrorMsg = true;
        $timeout(function() {
          $scope.showErrorMsg = false;
        }, 2000);
      }
    }
    // 记录券的来源
    $scope.cashNum = ipCookie('cashNum') || '';
    $scope.cashType = ipCookie('cashType') || '';
    $scope.rateNum = ipCookie('rateNum') || '';
    $scope.rateType = ipCookie('rateType') || '';

    //选择券
    $scope.showSelectIncreaseRateCoupon = false;
    $scope.selectCoupon = function(coupon){
        $scope.selectIncreaseRateCoupon = coupon;
        $scope.showSelectIncreaseRateCoupon = false;
        $scope.increaseRateProfit = $scope.calcProfit(coupon.value);
        $scope.resetInitLimit();
        //选择现金券时判断投资金额是否满足条件
        if(coupon.type ===2){
          $scope.showCashMsg($scope.project.investAmount);
        }
    }
    //不使用券
    $scope.unUseIncreaseRateCoupon = function(){
        $scope.selectIncreaseRateCoupon = null;
        $scope.showSelectIncreaseRateCoupon = false;
        $scope.increaseRateProfit = 0;
        $scope.resetInitLimit();
        $scope.unSelectCouponMsg = '暂不使用';
    }

    //跳转到充值页面
    $scope.toRecharge = function(){
      if($rootScope.timeout){
        $state.go('root.userCenter.recharge');
      }
    }

    //计算预计收益
    $scope.calcProfit = function(annualEarnings){
        var profit = $scope.project.investAmount * $scope.project.projectDays * annualEarnings / 36500 ;
        return profit;
    }

    /**
     * 修改投资金额
     */
    $scope.modInvestAmout = function(offset){
      $scope.project.investAmount = $scope.project.investAmount ? $scope.project.investAmount + offset : offset;
      $scope.project.investAmount = $scope.project.investAmount < 100 ? 100 : $scope.project.investAmount;
    }

    /**
     * 虚拟键盘弹出遮住输入框问题
     */
    angular.element('.invest-input').bind({
      focus: function(){
        angular.element('.new-project-detail').css('margin-bottom','100px');
      },
      blur: function(){
        angular.element('.new-project-detail').css('margin-bottom','0');
      }
    })
  });
