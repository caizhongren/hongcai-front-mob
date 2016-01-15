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
      console.log($scope.comments);
      $scope.commenters = [];
      for (var i = 0; i < $scope.comments.length; i++) {
        if ($scope.comments[i].commentType === 2) {
          $scope.comments[i].commenter = "danny";
        }
        $scope.commenters[i] = $scope.comments[i].commenter;
        $scope.commenters.push();

      }
      $scope.commenters = $.unique($scope.commenters);

      // for (var i = 0; i < $scope.comments.length; i++) {
      //   for (var j = 0; i < $scope.comments.length; j++) {
      //     if ($scope.comments[i].parentId > 0) {
      //       if ($scope.comments[i].parentId === $scope.comments[j].sceneCommentId) {
      //         console.log(i+"回复" + j);
      //       }
      //     }
      //   }
      // }


    });


  });
