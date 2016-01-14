'use strict';

angular.module('p2pSiteMobApp')
  .controller('RealSceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.userHeadImgUrl = '/images/activity/head@2x.png';
    $scope.baseFileUrl = config.base_file_url;
    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";

    if ($rootScope.hasLoggedUser.headImgUrl) {
      $scope.userHeadImgUrl = $rootScope.hasLoggedUser.headImgUrl;
    }
    Restangular.one('sceneActivity').post('userScene', {
      sceneId: $stateParams.sceneId
    }).then(function(response) {
      console.log(response);
      $scope.commentData = response;
      $scope.comments = response.comments;
    });


  });