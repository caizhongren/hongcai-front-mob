'use strict';

angular.module('p2pSiteMobApp')
  .controller('RealSceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.userHeadImgUrl = '/images/activity/head@2x.png';
    $scope.baseFileUrl = config.base_file_url;
    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";


    $rootScope.checkSession.promise.then(function() {
      if ($rootScope.hasLoggedUser.headImgUrl) {
        $scope.userHeadImgUrl = $rootScope.hasLoggedUser.headImgUrl;
        $scope.userNickName = $rootScope.hasLoggedUser.nickName;
      }
    });

    Restangular.one('sceneActivity', 'userScene').one($stateParams.sceneId).get().then(function(response) {

      $scope.commentData = response;
      $scope.comments = response.comments;


    });


  });
