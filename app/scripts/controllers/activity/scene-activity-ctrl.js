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
      $state.go("root.activity-real", {
        sceneId: sceneId
      });
    }


  });
