/*
* @Author: Administrator
* @Date:   2016-08-03 17:08:13
* @Last Modified by:   Administrator
* @Last Modified time: 2016-08-09 10:02:17
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('NewOrdersCtrl', function($state, $rootScope, $scope, WEB_DEFAULT_DOMAIN, restmod, Restangular, $stateParams) {

    /**
     * 项目信息
     */
    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $scope.projectId = response.id;
      $scope.projectType = response.type;
       /**
       * 项目订单列表
       */
      var siteProject = restmod.model(WEB_DEFAULT_DOMAIN + '/siteProject');
      $scope.projectOrders = function(projectId, projectType) {
        siteProject.$find('/projectOrders', {
          projectId: $scope.projectId,
          projectType: $scope.projectType
        }).$then(function(response) {
          if (response.ret !== -1) {
            $scope.orderList = response.data.orderList;

          }
        });
      }
      $scope.projectOrders($scope.projectId,$scope.projectType);
    })

    /**
     * 加载更多
     */
    $scope.initLimit = 6;
    $scope.loadMore = function() {
      $scope.initLimit = $scope.initLimit + 3 < $scope.orderList.length ? $scope.initLimit + 3 : $scope.orderList.length;
    };
  })
