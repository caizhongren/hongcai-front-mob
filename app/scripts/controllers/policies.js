'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:policiesCtrl
 * @description
 * # policiesCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('policiesCtrl', function($scope, $stateParams) {
    $scope.policiesId = parseInt($stateParams.id) || 0;
    $scope.policiesList = [
      {
        title: '中华人民共和国电子签名法'
      },
      {
        title: '最高人民法院关于审理民间借贷案件适用法律若干问题的规定'
      },
      {
        title: '网络借贷信息中介机构业务活动管理暂行办法 '
      },
      {
        title: '中国人民银行等十部委发布《关于促进互联网金融健康发展的指导意见》'
      },
      {
        title: 'P2P网络借贷风险专项整治工作实施方案'
      },
      {
        title: '网络借贷资金存管业务指引'
      },
      {
        title: '网络借贷信息中介机构业务活动信息披露指引'
      }
    ]

});
