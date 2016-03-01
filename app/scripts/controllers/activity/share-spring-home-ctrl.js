'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSpringHomeCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, DialogService) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;
    $scope.coverLayerFlag = false;
    
    $scope.freeWishes = Restangular.one('freeWishes').getList().$object;

    $scope.buttonClick = function(buttonFlag){
      if(buttonFlag == 1 || buttonFlag == 3 || buttonFlag == 4){
        $scope.openFreeWish();
      }else if(buttonFlag == 2){
        $scope.goShareDetail();
      }else if(buttonFlag == 5){
        $scope.goAccount();
      }
    }

    /**
     * 领取免费愿望
     * @return freeWish
     */
    $scope.openFreeWish = function(){
      if (!($rootScope.bindWechat || $rootScope.isLogged)){
        //引导用户关注
        $scope.coverLayerFlag = true;
        return;
      }
      
      Restangular.one('freeWishes').post('addFreeWish', {
        userId: $rootScope.userInfo.id,
        level: $scope.level
      }).then(function(response){
          console.log(response);
          if(response.ret === -1){
            // DialogService.alert('领取出错', response.msg, function(){
            //   $rootScope.alert = null;
            // });
            alert(response.msg);
          }else{
            var rediretUrl = config.domain + '/share-spring/detail/' + response.number;
            // alert(rediretUrl);
            if ($scope.channelCode){
              rediretUrl = rediretUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
            }
            // alert(rediretUrl);
            window.location.href = rediretUrl;
          }
      });
    }

    $scope.goShareDetail = function(){
      Restangular.one('freeWishes', $rootScope.userInfo.id).one('myFreeWish').get({
          level : $scope.level
        }).then(function(response){
        if(response !== undefined && response.id > 0){
          $state.go('root.share-spring.detail',{
            number: response.number,
            act: $scope.act,
            f: $scope.channelCode
          });
        }
      });
    }

    $scope.goAccount = function(){
      window.location.href = config.domain + '/user-center/account'
    }
});
