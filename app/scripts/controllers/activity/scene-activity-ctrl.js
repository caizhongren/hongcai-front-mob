'use strict';

angular.module('p2pSiteMobApp')
  .controller('SceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";

    $scope.baseFileUrl = config.base_file_url;
    Restangular.one('sceneActivity', 'scenes').getList().then(function(response) {
      $scope.scenesData = response;
    });

    $scope.goSceneDetail = function(sceneId) {
      Restangular.one('sceneActivity').post('userScene', {
        sceneId: sceneId
      }).then(function(response) {
        if (response.ret !== -1) {
          var shareUrl = config.domain + '/share-scene/' + response.id;
          console.log(shareUrl);
          window.location.href = shareUrl;
          // window.location.href("root.share-scene", {
          //   sceneId: response.id
          // });
          // $state.go("root.share-scene", {
          //   sceneId: response.id
          // });
        }
      });
    }



  });
