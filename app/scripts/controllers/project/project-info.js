'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectDetailCtrl
 * @description
 * # ProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectInfoCtrl', function($scope, $state, $rootScope, $stateParams, $location, fundsProjects,$interval, Restangular, restmod, DEFAULT_DOMAIN, WEB_DEFAULT_DOMAIN, config, projectStatusMap,DateUtils, Utils) {
    // 宏金盈详情页面
    $rootScope.showFooter = false;
    var number = $stateParams.number;
    if (!$stateParams.number) {
      $state.go('root.main');
    }

    $scope.projectStatusMap = projectStatusMap;


    $scope.repaymentTypeMap = {'1': '按月付息 到期还本', '2': '按月返还 等额本息', '3': '按季付息 到期还本', '4': '半年付息 到期还本', '5': '到期还本付息'};
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $rootScope.headerTitle = response.name;
      Utils.setTitle($rootScope.headerTitle);

      $scope.project = response;
      $scope.serverTime = response.createTime || (new Date().getTime());
      $scope.project.countdown = new Date(response.releaseStartTime).getTime() - $scope.serverTime;
      $scope.project._timeDown = DateUtils.toHourMinSeconds($scope.project.countdown);
      if($scope.project.status === 7){
        $rootScope.tofinishedOrder();
      }
      Restangular.one('projects').one($scope.project.id+'/info').get().then(function(response){
        $scope.jigoubaoDataMore = response;
      });

      /**
       * 项目详情页风控审核
       */
      var siteProject = restmod.model(WEB_DEFAULT_DOMAIN + '/siteProject/getProjectRisk?number='+$stateParams.number);
      siteProject.$create({}).$then(function(response){
        if(response.ret ===1){
          $scope.getProjectRisk = response.data.riskControl;
        }
      })
    });


  });
