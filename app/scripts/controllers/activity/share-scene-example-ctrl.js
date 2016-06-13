'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSceneExampleCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.test = config.test;
    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";

    $scope.baseFileUrl = config.base_file_url;

    $rootScope.checkSession.promise.then(function() {
        if($rootScope.channelCode){
          Restangular.one('users').post('channel', {
            openId: $rootScope.openid, 
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
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
      if ($rootScope.channelCode){
        shareUrl = shareUrl + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }
      window.location.href = shareUrl;
    }
  });
