'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareHomeCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, DialogService) {
    
    $rootScope.showButton = false;
    $scope.test = config.test;

    $scope.buttonFlag = true;
    $scope.coverLayerFlag = false;
    $rootScope.checkSession.promise.then(function(){
        if($rootScope.userInfo.id > 0){
          Restangular.one('freeWishes', $rootScope.userInfo.id).one('myFreeWish').get().then(function(response){
            if(response !== undefined){
              if(response.id > 0){
                  $scope.myFreeWish = response;
                  $scope.buttonFlag = false;
              }
            }
          });
        }

        Restangular.one('freeWishes').post('channel', {
          openId: $rootScope.openid, 
          act: $stateParams.act,
          channelCode: $stateParams.f
        });
    });
    $scope.freeWishes = Restangular.one('freeWishes').getList().$object;

    /**
     * 领取免费愿望
     * @return freeWish
     */
    $scope.openFreeWish = function(){
      if (!$rootScope.userInfo || $rootScope.userInfo.id == 0){
        $scope.coverLayerFlag = true;
        return;
      }
      
      Restangular.one('freeWishes').post('addFreeWish', {
        userId: $rootScope.userInfo.id
      }).then(function(response){
          console.log(response);
          if(response.ret === -1){
            // DialogService.alert('领取出错', response.msg, function(){
            //   $rootScope.alert = null;
            // });
            alert(response.msg);
          }else{
            $scope.freeWish = response;
            $state.go("root.share-detail",{
              number: response.number
            });
          }
      });
    }

    $scope.goShareDetail = function(){
      $state.go("root.share-detail",{
        number: $scope.myFreeWish.number
      });
    }
});
