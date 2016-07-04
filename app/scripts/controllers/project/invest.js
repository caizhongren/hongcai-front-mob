'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectDetailCtrl
 * @description
 * # ProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('InvestCtrl', function($scope, $state, $rootScope, $stateParams, $location, fundsProjects, Restangular, restmod, DEFAULT_DOMAIN, config, projectStatusMap) {
    //宏金盈详情页面
    var number = $stateParams.number;
    if (!$stateParams.number) {
      $state.go('root.main');
    }

    $scope.unSelectCouponMsg = '暂无可用加息券';
    $scope.initLimit = 3;
    $scope.resetInitLimit = function(){
        $scope.initLimit = 3;
    }

    $scope.projectStatusMap = projectStatusMap;
    $scope.profit = 0;
    $scope.increaseRateProfit = 0;
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $scope.project = response;
      $scope.jigoubaoDataMore = $scope.project.projectInfo;
      // 可投资金额
      $scope.project.availableAmount = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
      
      $scope.increaseRateCoupons = [];
      Restangular.one('projects').one('investIncreaseRateCoupon').get({
        projectId : $scope.project.id,
        amount : $scope.project.availableAmount
      }).then(function(response) {
        $scope.increaseRateCoupons = response;
        $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[0];
      });

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
                $scope.showMsg(payAmount);
              }
            } else {
              $scope.msg = order.msg;
              $scope.showMsg(payAmount);
            }
          })
        }
      }
    };

    $scope.showErrorMsg = false;
    $scope.investButtonFlag = false;
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
        if(newVal > $scope.project.availableAmount){
          $scope.msg = '投资金额必须小于' + $scope.project.availableAmount;
        }else if(newVal > $rootScope.account.balance){
          $scope.msg = '账户余额不足，请先充值';
        } else if(newVal % $scope.project.increaseAmount){
          $scope.msg = '投资金额必须为' + $scope.project.increaseAmount + '的整数倍';
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

    $scope.calcProfit = function(annualEarnings){
        var profit = $scope.project.investAmount * $scope.project.projectDays * annualEarnings / 36500 ;
        return profit;
    }

    $scope.viewMoreCoupon = function(){
        $scope.initLimit = $scope.initLimit + 3 < $scope.increaseRateCoupons.length ? $scope.initLimit + 3 : $scope.increaseRateCoupons.length;
    }
  });
