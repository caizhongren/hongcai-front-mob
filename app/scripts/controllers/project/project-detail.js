'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:NewProjectDetailCtrl
 * @description
 * # NewProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectDetailCtrl', function(ipCookie, $scope, $timeout, $state, $rootScope, $stateParams, $location,$interval, Restangular, projectStatusMap, ProjectUtils, Utils) {
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
      if($rootScope.isLogged){
        $scope.increaseRateCoupons = [];
        $scope.selectIncreaseRateCoupon = [];
        Restangular.one('projects').one('investIncreaseRateCoupon').get({
          projectId : $scope.project.id,
          amount : project.availableAmount
        }).then(function(response) {
          if (response && response.ret && response.ret !== -1) {
            $scope.increaseRateCoupons = response;
            for (var i = 0; i < $scope.increaseRateCoupons.length; i++) {
              if ($scope.rateType === '' && $scope.cashType === '') {
                $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[0];
              }
              if ($scope.rateNum == $scope.increaseRateCoupons[i].number || $scope.cashNum == $scope.increaseRateCoupons[i].number) {
                $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[i];
              }
            }
          }else {
            $scope.selectIncreaseRateCoupon = [];
          }
          $scope.project.investAmount =  1000 ;
        });
      }
    });

    $rootScope.tofinishedOrder();

    /**
     * 下单并支付
     */
    $scope.clicked = true;
    $scope.toInvest = function(project) {
      $scope.clicked = false;
      if($scope.msg || project.investAmount < project.minInvest){
        return;
      }

      $scope.showMsg();
      $rootScope.tofinishedOrder();
      var couponNumber = $scope.selectIncreaseRateCoupon != null ? $scope.selectIncreaseRateCoupon.number : '';
      $rootScope.showLoadingToast = true;
      Restangular.one('projects').one(number+'/users/' + '0').post('investment', {
        investAmount: project.investAmount,
        couponNumber: couponNumber,
        device: Utils.deviceCode()
      }).then(function(order){
        $rootScope.showLoadingToast = false;
        $scope.clicked = true;
        // 重复下单后，response.number为undefined
        if (order && order.ret !== -1) {
          $state.go('root.yeepay-transfer', {
            type: 'transfer',
            number: order.number
         });
        } else {
          $scope.msg = order.msg;
          $scope.showMsg();
        }
      });
    };


    $scope.$watch('project.investAmount', function(newVal, oldVal){
      if(!$rootScope.isLogged){
        return;
      }

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
        } else if(newVal < $scope.project.minInvest ){
          $scope.msg = '投资金额必须大于' + $scope.project.minInvest;
        } else if(newVal % $scope.project.increaseAmount !==0 ){
          $scope.msg = '投资金额必须为' + $scope.project.increaseAmount + '的整数倍';
        }
      }

      if($scope.selectIncreaseRateCoupon && $scope.project){
        $scope.profit = $scope.calcProfit($scope.project.annualEarnings) || 0;
        if($scope.selectIncreaseRateCoupon.type ===1){
          $scope.increaseRateProfit = $scope.selectIncreaseRateCoupon != null ? $scope.calcProfit($scope.selectIncreaseRateCoupon.value) : 0;
        } else{
          $scope.showCashMsg(newVal);
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
      if($scope.project && $scope.project.status == 7){
        $rootScope.showMsg($scope.msg);
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
        $scope.cashProfit = $scope.project.investAmount >= $scope.selectIncreaseRateCoupon.minInvestAmount ? $scope.selectIncreaseRateCoupon.value : 0;
        $scope.resetInitLimit();
        //选择现金券时判断投资金额是否满足条件
        if(coupon.type ===2){
          $scope.msg = '';
          if($scope.msg){
            $scope.showCashMsg($scope.project.investAmount);
          }else{
            $scope.showCashMsg($scope.project.investAmount);
          }
        }else{
          $scope.msg = '';
        }
    }
    //不使用券
    $scope.unUseIncreaseRateCoupon = function(){
        $scope.selectIncreaseRateCoupon = null;
        $scope.showSelectIncreaseRateCoupon = false;
        $scope.increaseRateProfit = 0;
        $scope.resetInitLimit();
        $scope.unSelectCouponMsg = '暂不使用';
        if($scope.msg){
          $scope.msg = '';
        }
    }

    //跳转到充值页面
    $scope.toRecharge = function(){
      if($rootScope.timeout){
        $state.go('root.userCenter.recharge');
      }
    }

    /**
     * 跳转到投资记录页
     */
    $scope.toOrderList = function(){
      if(!$rootScope.isLogged){
        return;
      }else{
        $state.go('root.orders', {
          number: $stateParams.number
       });
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
    $scope.modInvestAmout = function(offset,$event){
      $event.stopPropagation();
      $scope.project.investAmount = $scope.project.investAmount ? $scope.project.investAmount + offset : offset;
      $scope.project.investAmount = $scope.project.investAmount < 100 ? 100 : $scope.project.investAmount;
    }
    //查看更多
    $scope.viewMoreCoupon = function(){
      $scope.initLimit = $scope.initLimit + 3 < $scope.increaseRateCoupons.length ? $scope.initLimit + 3 : $scope.increaseRateCoupons.length;
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
