'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {

    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '回款中',
    }, {
      title: '已回款',
    }];

    $rootScope.selectedSide = 'investments-stat';
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.creditsDetail = [];

    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/totalProfit').$then(function(response){
        if (response.$status === 'ok') {
          $scope.totalProfit = response;
        }
      });
    }
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
      if (tabIndex === 0) {
        $scope.creditStatus = '1,2';
      } else {
        $scope.creditStatus = '3';
      }
      $scope.getCredits($scope.creditStatus);
      $scope.getCreditList($scope.creditStatus);
    };



    $scope.getCredits = function(status) {
      if ($rootScope.hasLoggedUser) {
        $scope.creditStatus = status;
        $scope.credits = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/credits', {
          status: $scope.creditStatus,
          page: $scope.page,
          pageSize: $scope.pageSize
        });
      }
    };

    // $scope.loadCreditMore = function() {
    //   $scope.pageSize = $scope.pageSize + 10;
    //   $scope.getCredits($scope.creditStatus);
    // };

    $scope.getCredits('1,2');

    //以下为自动加载代码

     $scope.getCreditList = function(status){
       if ($rootScope.hasLoggedUser) {
        $scope.creditStatus = status;
        var creditsReq = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/credits', {
          status: $scope.creditStatus,
          page: $scope.page,
          pageSize: $scope.pageSize
        });
        creditsReq.$then(function(response){
          if(response.$status === 'ok'){
              for (var i = 0; i < response.data.length; i++) {
                $scope.creditsDetail.push(response.data[i]);
              };
          }
        });
      }
     }
    $scope.getCreditList('1,2');
    $scope.loadCreditMuch = function(){
      $scope.creditsBusy = true;
      $scope.pageSize = $scope.pageSize + 10;
      $scope.getCreditList();
      $scope.creditsBusy = false;
    }

  }]);
