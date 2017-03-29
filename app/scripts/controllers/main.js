'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', function($scope, $rootScope, $state, Restangular, ProjectUtils, ScreenWidthUtil, $timeout) {
    $scope.widthFlag = "";
    $scope.projectDatas = [];
    $rootScope.showLoadingToast = true;
    $rootScope.showLoadingToast = $scope.projectDatas.length >=3 ? false : true;
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

    //查询网站公告
    $scope.getNotice = function(){
      $rootScope.showLoadingToast = true;
      Restangular.one('userMsgs/0/notices').get({
        page: 1,
        pageSize: 3
      }).then(function(response){
        if(response && response.ret !== -1) {
            $scope.notices = response.data;
        }

      })
    }
    $scope.getNotice();

    /**
     * 宏财精选、宏财尊贵
     */
    $scope.getProjectList = function(page, pageSize, type) {
      $rootScope.showLoadingToast = true;
      $scope.busy = true;

      if ($scope.pageCount < $scope.page) {
        return;
      }
      Restangular.one('projects').get({
        page: page,
        pageSize: pageSize,
        type: type
      }).then(function(response) {
        if (type == 5) {
          response.projectList[0].projectType = '宏财精选';
          response.projectList[0].tab = '0';
          $scope.projectDatas.push(response.projectList[0]);
          
        }else if (type == 6) {
          response.projectList[0].projectType = '宏财尊贵';
          response.projectList[0].tab = '1';
          
          $scope.projectDatas.push(response.projectList[0]);
        }

        $timeout(function() {
          $scope.busy = false;
        }, 10);

      });
    }
    /**
    *债权转让列表
    */
    $scope.getAssignmentList = function(page, pageSize) {
      $rootScope.showLoadingToast = true;
      $scope.busy = true;
      Restangular.one("assignments").get({
        page: page,
        pageSize: pageSize
      }).then(function(response){
        if(response && response.ret !== -1) {
          response.assignments[0].projectType = '债权转让';
          response.assignments[0].tab = '2';
          $scope.projectDatas.push(response.assignments[0]);
          $timeout(function() {
            $scope.busy = false;
          }, 10);
        }
      })
    }

    $scope.getProjectList(1, 1, 5);
    $scope.getProjectList(1, 1, 6);
    $scope.getAssignmentList(1, 1);

    /**
     * 跳转到详情页
     */
    $scope.toDetail = function(project){
      if($rootScope.timeout){
        project.tab ==2 ? $state.go('root.assignments-detail', {number: project.number}) : $state.go('root.project', {number: project.number});
      }
    }


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
