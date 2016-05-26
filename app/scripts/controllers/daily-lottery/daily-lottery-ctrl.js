'use strict';

angular.module('p2pSiteMobApp')
  .controller('DailyLotteryCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, $location, Restangular, config, DialogService) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;
    $scope.coverLayerFlag = false;
    $rootScope.checkSession.promise.then(function() {
      if (!$rootScope.isLogged) {
        $location.path('/login');
        return;
      }

      Restangular.one('dailyPrizes').get().then(function(response){
        $scope.thisWeekCheckinRecords = response;

        console.log($scope.thisWeekCheckinRecords);
      });
    });

    $scope.formatDate = function(date){
      var dateOfMonth = new Date(date).getMonth() + 1;
      var dateOfHour = new Date(date).getDate();
      var dateStr = dateOfMonth + '.' + dateOfHour;

      return dateStr;
    }

    if ($scope.channelCode){
      Restangular.one('users').post('channel', {
        openId: $rootScope.openid, 
        act: $scope.act,
        channelCode: $scope.channelCode
      });
    }

    /**
     * 跳转到二维码位置
     */
    $scope.goToAttention = function(){
      $scope.showQRcode = true;
    }
});
