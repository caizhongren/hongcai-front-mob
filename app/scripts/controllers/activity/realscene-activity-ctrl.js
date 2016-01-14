'use strict';

angular.module('p2pSiteMobApp')
  .controller('RealSceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    console.log($stateParams.sceneId);
    $scope.baseFileUrl = config.base_file_url;
    // Restangular.one('sceneActivity', 'userScene').getList().then(function(response) {
    //   $scope.scenesData = response;
    //   var numberId = $stateParams.sceneId - 1;
    //   $scope.sceneData = $scope.scenesData[numberId];
    //   console.log($scope.sceneData);
    // });
    console.log($rootScope.nickName);
    if ($rootScope.hasLoggedUser.portraitUrl) {
      $scope.userHeadImgUrl = $rootScope.hasLoggedUser.portraitUrl;
    }
    Restangular.one('sceneActivity').post('userScene', {
      sceneId: $stateParams.sceneId
    }).then(function(response) {
      console.log(response);
      $scope.commentData = response;
      $scope.comments = response.comments;
    });


  });
