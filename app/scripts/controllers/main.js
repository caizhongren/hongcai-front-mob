'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', function($scope, $rootScope, $state, Restangular, ProjectUtils) {


    /**
     * 获取新手标项目
     */
    Restangular.one('projects').one('newbieBiaoProject').get().then(function(response) {
      if(!response || response.ret === -1){
          return;
      }
      $scope.newbieBiaoProject = response;
      // 可投资金额
      $scope.newbieBiaoProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
      var serverTime = response.createTime || (new Date().getTime());
      ProjectUtils.projectTimedown($scope.newbieBiaoProject, serverTime);
    });


     /**
     * 推荐项目
     */
    Restangular.one('projects').one('recommends').get({
      pageSize : 1
    }).then(function(response) {
      $scope.recommends = response.data[0];
      var serverTime = response.data[0].createTime || (new Date().getTime());
      ProjectUtils.projectTimedown($scope.recommends, serverTime);
    });


    $rootScope.checkSession.promise.then(function() {
      /**
       * 是否激活存管通
       */
       $rootScope.toActivate();
    });



   /**
    * 查看自动投标
    */
    $scope.goAutoTender = function(){
      if(!$rootScope.isLogged) {
        $rootScope.toLogin();
        return;
      }
      $state.go('root.userCenter.setting');
    }

  });
