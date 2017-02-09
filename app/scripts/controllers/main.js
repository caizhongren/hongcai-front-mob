'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', function($scope, $rootScope, $state, Restangular, ProjectUtils, $timeout, $location) {
    $rootScope.showLoadingToast = true;

    /**
     * 获取新手标项目
     */
    Restangular.one('projects').one('newbieBiaoProject').get().then(function(response) {
      if(!response || response.ret === -1){
          return;
      }
      $scope.newbieBiaoProject = response;
      $rootScope.showLoadingToast = false;
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
      $rootScope.showLoadingToast = false;
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
    /**
     * 查看体验金
     */
    $scope.toExperience =function() {
      if(!$rootScope.isLogged) {
        $state.go('root.register');
        return;
      }
      $state.go('root.userCenter.experience-money');
    }

    /**
     * 轮播图
     * 注意：需要等待页面元素加载完成后在执行轮播；页面dot 手动增减个数
     */
     $timeout(function() {
    // $scope.$on('$viewContentLoaded', function(){
        $('.slide').swipeSlide({
          autoSwipe : true,
          axisX : true,
          continuousScroll:true,
          speed : 2000,
          transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
          firstCallback : function(i,sum,me){
              me.find('.dot').children().first().addClass('cur');
          },
          callback : function(i,sum,me){
              me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
          }
        });
  
    },100);

  });
