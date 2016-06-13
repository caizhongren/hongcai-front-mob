'use strict';

angular.module('p2pSiteMobApp')
  .controller('SceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

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
        if(!$rootScope.hasLoggedUser || $rootScope.hasLoggedUser.id <=0){
          $state.go('root.share-scene-example');
        }
    });

    Restangular.one('sceneActivity', 'scenes').getList().then(function(response) {
      $scope.scenesData = response;
    });

    $scope.goSceneDetail = function(sceneId) {
      Restangular.one('sceneActivity').post('userScene', {
        sceneId: sceneId,
        size: 4
      }).then(function(response) {
        if (response.ret !== -1) {
          var shareUrl = config.domain + '/share-scene/' + response.id;
          if ($rootScope.channelCode){
            shareUrl = shareUrl + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
          }
          window.location.href = shareUrl;
        }
      });
    }



  });
