'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('FundsProjectDetailCtrl', function($scope, $state, $rootScope, $stateParams, fundsProjects, restmod, DEFAULT_DOMAIN, config) {
    // 宏金盈详情页面
    var number = $stateParams.number;
    if (!number) {
      $state.go('root.main');
    }

    $scope.showFundsAgreement = false;
    $scope.toggle = function () {
      $scope.showFundsAgreement = !$scope.showFundsAgreement;
    };

    $rootScope.checkSession.promise.then(function(){
       // simple project
       fundsProjects.$find(number).$then(function(response) {
         if (response.$status === 'ok') {
           // 项目详情
           $scope.simpleFundsProject = response;
           // 可投资金额
           $scope.fundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
           // 当status===1可融资状态的时候，判断fundsFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动投资用户。
           if ($scope.simpleFundsProject.status === 1) {
             if ($rootScope.account) {
               // 用户可投资金额
               $scope.userCanFundsInvestNum = $scope.fundsProjectInvestNum > $rootScope.account.balance ? $rootScope.account.balance : $scope.fundsProjectInvestNum;

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
             } else {
               $scope.userCanCreditInvestNum = 0;
               $scope.fundsFlag = 0;
             }
           }
         } else {
           // do anything?
           // 请求数据失败，请重新加载该页面
         }
       }); 
    });

    

    $scope.statusMap = {
      1: '融资中',
      2: '融资成功',
      3: '融资结束',
      4: '还款中',
      5: '还款完成'
    };

    $scope.checkLargeUserCanAmount = function(project) {
      if ($rootScope.account) {
        if ($rootScope.account.balance < project.investAmount) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
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

    $scope.checkAutoTransfer = function(simpleFundsProject) {
      if ($scope.fundsFlag !== 3) {
        $scope.simpleFundsProject.isRepeatFlag = false;
        simpleFundsProject.isRepeatFlag = false;
        $scope.msg = "您还没有开通自动续投";
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

    $scope.toInvest = function(simpleFundsProject) {
      if (simpleFundsProject.isRepeatFlag && $scope.fundsFlag === 3) {
        $scope.isRepeat = 1;
      } else {
        $scope.isRepeat = 2;
      }
      $scope.investAmount = simpleFundsProject.investAmount;
      if ($scope.fundsFlag === 0) {
        $state.go('root.login');
      } else if ($scope.fundsFlag === 1) {
        // 需要跳到实名认证页面
      } else if ($scope.checkLargeUserCanAmount(simpleFundsProject)) {
        $state.go('root.yeepay-transfer', {
              type: 'recharge',
              number: $scope.investAmount - $rootScope.account.balance + ($rootScope.account.reward == null ? 0 : $rootScope.account.reward)
        });
        // $state.go('root.user-center.recharge');
      } else if ($scope.fundsFlag === 2 || $scope.fundsFlag === 3) {
        // how to bulid investment path restmod.model
        // restmod.model(DEFAULT_DOMAIN + '/projects')
        restmod.model(DEFAULT_DOMAIN + '/fundsProjects/' + number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
          // fundsProjects.$find(number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
          amount: simpleFundsProject.investAmount,
          projectId: simpleFundsProject.id,
          isRepeat: $scope.isRepeat
        }).$then(function(response) {
          // 重复下单后，response.number为undefined
          if (response.$status === 'ok') {
            if (response.number !== null && response.number !== undefined) {
              restmod.model(DEFAULT_DOMAIN + '/orders/' + response.number + '/users/' + $rootScope.hasLoggedUser.id + '/payment').$create().$then(function(response) {
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
            $scope.msg = "服务器累瘫了，请稍后访问。";
          }
        })
      }
    };

  });
