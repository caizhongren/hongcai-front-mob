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
    $scope.choiceProject = [];
    $scope.choiceProject.name = '宏财精选项目';
    $scope.choiceProject.tab = 0;
    $scope.choiceProject.amount = 0;
    $scope.choiceProject.projectDays = 0;
    $scope.choiceProject.annualEarnings = 0.00;
    $scope.honorableProject = [];
    $scope.honorableProject.name = '宏财尊贵项目';
    $scope.honorableProject.tab = 1;
    $scope.honorableProject.amount = 0;
    $scope.honorableProject.projectDays = 0;
    $scope.honorableProject.annualEarnings = 0.00;
    $scope.assignmentProject = [];
    $scope.assignmentProject.name = '债权转让项目';
    $scope.assignmentProject.tab = 2;
    $scope.assignmentProject.currentStock = 0;
    $scope.assignmentProject.remainDay = 0;
    $scope.assignmentProject.annualEarnings = 0.00;

    $rootScope.showLoadingToast = true;

    //限制项目名长度
    $scope.widthFlag = ScreenWidthUtil.screenWidth();
    $scope.go_moreMsg =function (){
      if ($rootScope.isLogged) {
        $state.go('root.userCenter.messages');
      }else {
        $state.go('root.login');
      }
    }

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
        $rootScope.showLoadingToast = false;
        if (type == 5) {
          $scope.choiceProject.name = response.projectList[0].name;
          $scope.choiceProject.amount = response.projectList[0].amount;
          $scope.choiceProject.projectDays = response.projectList[0].projectDays;
          $scope.choiceProject.annualEarnings = response.projectList[0].annualEarnings;
          $scope.choiceProject.number = response.projectList[0].number;
        }else if (type == 6) {
          $scope.honorableProject.name = response.projectList[0].name;
          $scope.honorableProject.amount = response.projectList[0].amount;
          $scope.honorableProject.projectDays = response.projectList[0].projectDays;
          $scope.honorableProject.annualEarnings = response.projectList[0].annualEarnings;
          $scope.honorableProject.number = response.projectList[0].number;
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
          $scope.assignmentProject.name = response.assignments[0].name;
          $scope.assignmentProject.currentStock = response.assignments[0].currentStock;
          $scope.assignmentProject.remainDay = response.assignments[0].remainDay;
          $scope.assignmentProject.annualEarnings = response.assignments[0].annualEarnings;
          $scope.assignmentProject.number = response.assignments[0].number;
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
        project.tab == 2 ? $state.go('root.assignments-detail', {number: project.number}) : $state.go('root.project', {number: project.number});
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
