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

    Restangular.one('banners').one('/').get({
      type : 2
    }).then(function(response){
      if(!response || response.ret == -1) { return;}
      $scope.banners = response;

      /**
       * 轮播图
       * 注意：需要等待页面元素加载完成后在执行轮播；页面dot 手动增减个数
       */
      setTimeout(function() {
        $('.slide').swipeSlide({
          autoSwipe : true,
          axisX : true,
          continuousScroll:true,
          speed : 1500,
          transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
          firstCallback : function(i,sum,me){
              me.find('.dot').children().first().addClass('cur');
          },
          callback : function(i,sum,me){
              me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
          }
        });
      }, 100);
    });

    $scope.widthFlag = "";

    $scope.choiceProject = {
      name: '宏财精选项目',
      tab: 0,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    };

    $scope.honorableProject = {
      name: '宏财尊贵项目',
      tab: 1,
      amount: 0,
      projectDays: 0,
      annualEarnings: 0.00
    };

    $scope.assignmentProject = {
      name: '债权转让项目',
      tab: 2,
      currentStock: 0,
      remainDay: 0,
      annualEarnings: 0.00
    };

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
      Restangular.one('userMsgs/0/notices').get({
        page: 1,
        pageSize: 3
      }).then(function(response){
        if(response && response.ret !== -1) {
            $scope.notices = response.data;
            sessionStorage.setItem('notices', angular.toJson($scope.notices));
        }
      })
    }
    

    /**
     * 宏财精选、宏财尊贵
     */
    $scope.getProjectList = function(page, pageSize, type) {
      $rootScope.showLoadingToast = true;

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
          $scope.choiceProject = response.projectList[0];
          sessionStorage.setItem('choice', angular.toJson($scope.choiceProject));
        } else if (type == 6) {
          $scope.honorableProject = response.projectList[0];
          sessionStorage.setItem('honor', angular.toJson($scope.honorableProject));
        }
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
          sessionStorage.setItem('assignment', angular.toJson($scope.assignmentProject));
        }
      })
    }

    $scope.choiceProject = sessionStorage.getItem('choice') ? angular.fromJson(sessionStorage.getItem('choice')) : $scope.choiceProject;
    $scope.honorableProject = sessionStorage.getItem('honor') ? angular.fromJson(sessionStorage.getItem('honor')) : $scope.honorableProject;
    $scope.assignmentProject = sessionStorage.getItem('assignment') ? angular.fromJson(sessionStorage.getItem('assignment')) : $scope.assignmentProject;
    $scope.notices = sessionStorage.getItem('notices') ? angular.fromJson(sessionStorage.getItem('notices')) : undefined;
    $scope.getNotice();
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


    $scope.clickBanner = function(toStateOrUrl){
      if(toStateOrUrl.indexOf('root.') !== -1){
        $state.go(toStateOrUrl);
      } else {
        window.location.href = toStateOrUrl;
      }
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
