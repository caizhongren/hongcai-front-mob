'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareHomeCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, md5, Restangular, config, DialogService) {
    
    $rootScope.showButton = false;
    $scope.test = config.test;

    $scope.buttonFlag = true;
    $scope.coverLayerFlag = false;
    $rootScope.checkSession.promise.then(function(){
        if($rootScope.hasLoggedUser.id > 0){
          console.log($rootScope.hasLoggedUser.id);
          Restangular.one('freeWishes', $rootScope.hasLoggedUser.id).one('myFreeWish').get().then(function(response){
            if(response !== undefined){
              if(response.id > 0){
                  $scope.myFreeWish = response;
                  $scope.buttonFlag = false;
              }
            }
          });
        }
        $scope.freeWishes = Restangular.one('freeWishes').getList().$object;
    });

    /**
     * 领取免费愿望
     * @return freeWish
     */
    $scope.openFreeWish = function(){
      if (!$rootScope.hasLoggedUser || $rootScope.hasLoggedUser.id == 0){
        $scope.coverLayerFlag = true;
        return;
      }
      
      Restangular.one('freeWishes').post('addFreeWish', {
        userId: $rootScope.hasLoggedUser.id
      }).then(function(response){
          console.log(response);
          if(response.ret === -1){
            DialogService.alert('不能领取拉', response.msg, function(){
              $rootScope.alert = null;
            });
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
