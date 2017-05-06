'use strict';
angular.module('p2pSiteMobApp')
  .controller('BindWechat', function($scope, $timeout) {
  	$scope.busy = false;
  	$scope.openAndCopy = function() {
      if($scope.busy){
        return;
      }

      $scope.busy = true;
      //复制公众号
  	  window.UMengShare.directShare('COPYLINK','','','宏财网','');
      if (ionic.Platform.isAndroid()) {
        // 安卓打开微信
        var sApp = startApp.set({"application":"com.tencent.mm"});
      }else {
        // ios打开微信
        var sApp = startApp.set("weixin://");
      }
      sApp.start(function() { /* success */
        console.log("OK");
      }, function(error) { /* fail */
        alert('未安装微信');
      });
      $timeout(function () {
        $scope.busy = false;
      }, 100);
  	}
      
  })