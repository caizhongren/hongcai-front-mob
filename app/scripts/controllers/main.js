'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', function($scope, $rootScope, $state, Restangular, ProjectUtils, ScreenWidthUtil) {
    $rootScope.showLoadingToast = true;
    $scope.widthFlag = "";
    //限制项目名长度
    $scope.widthFlag = ScreenWidthUtil.screenWidth();
    $scope.go_moreMsg =function (){
      if ($rootScope.isLogged) {
        $state.go('root.userCenter.messages');
      }else {
        $state.go('root.login');
      }
    }

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


    /**
     * 是否激活存管通
     */
      $rootScope.toActivate();



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

    // 公告轮播
    $scope.timer = function(opj) {
      $(opj).find('ul').animate({
        marginTop : "-1.4rem"  
        },500,function(){  
        $(this).css({marginTop : "0.0rem"}).find("li:first").appendTo(this);  
      })  
    }
  
    function _timer(opj) { 
      return function() { 
        $scope.timer(opj); 
      } 
    } 

    $rootScope.timer = setInterval(_timer(".notice_active"),4000);

  });
