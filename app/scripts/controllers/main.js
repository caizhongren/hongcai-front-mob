'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', ['$scope', '$state', 'projects', 'fundsProjects', function ($scope, $state, projects, fundsProjects) {

    // 获取宏金宝投资列表
    // $scope.projectsRecommendations = projects.$find('recommendations');
    // 获取宏金盈投资列表
    $scope.switchFundsProjects = function(type) {
      fundsProjects.$find('recommendations', {productType: type}).$then(function(response) {
        if (response.$status === 'ok') {
          $scope.recFundsProjects = response;
          // 可投资金额
          $scope.recFundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
        } else {
          // 访问接口失败；
        }
      });
    };
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '7日理财',
    }, {
      title: '1-6月理财'
    }];
    $scope.subTabs = [{
      title: '月月盈',
    }, {
      title: '季度盈',
    }, {
      title: '半年盈',
    }];
    // 默认调用七日盈。
    $scope.switchFundsProjects(1);

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
      var type = tabIndex + 1;
      $scope.switchFundsProjects(type);
    };
    $scope.toggle.switchSubTab = function(subTabIndex) {
      $scope.toggle.activeSubTab = subTabIndex;
      var type = subTabIndex + 2;
      $scope.switchFundsProjects(type);
    };
  }]);
