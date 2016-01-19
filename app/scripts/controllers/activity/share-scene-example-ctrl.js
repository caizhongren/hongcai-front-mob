'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSceneExampleCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;
    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";

    $scope.baseFileUrl = config.base_file_url;

    $rootScope.checkSession.promise.then(function() {
      if ($scope.channelCode){
          Restangular.one('freeWishes').post('channel', {
            openId: $rootScope.openid, 
            act: $scope.act,
            channelCode: $scope.channelCode
          });
        }
    });

    $scope.showFollowFlag = false;
    $scope.goActivityScenes = function(){
      if(!$rootScope.hasLoggedUser || $rootScope.hasLoggedUser.id <= 0){
        $scope.showFollowFlag = true;
        return;
      }

      var shareUrl = config.domain + '/activity-scene';
      if ($scope.channelCode){
        shareUrl = shareUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }
      window.location.href = shareUrl;
    }
  });
