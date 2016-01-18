'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSceneExampleCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.test = config.test;
    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";

    $scope.baseFileUrl = config.base_file_url;

    $rootScope.checkSession.promise.then(function() {
    });

    $scope.showFollowFlag = false;
    $scope.goActivityScene = function(){
      if(!$rootScope.hasLoggedUser || $rootScope.hasLoggedUser.id <= 0){
        $scope.showFollowFlag = true;
        return;
      }

      $state.go('root.activity-scene');
    }
  });
