'use strict';

angular.module('p2pSiteMobApp')
  .controller('SceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

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
        size: 5
      }).then(function(response) {
        if (response.ret !== -1) {
          var shareUrl = config.domain + '/share-scene/' + response.id;
          if ($scope.channelCode){
            shareUrl = shareUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
          }
          window.location.href = shareUrl;
        }
      });
    }



  });
