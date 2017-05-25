'use strict';
angular.module('p2pSiteMobApp')
  .controller('LotteryCtrl', function($scope, $rootScope, Restangular) {
  	/**
  	*抽奖动画
  	**/
  	var prizeList = {}, 
  	    prizes = ['现金奖励','加息一天','加息券','特权本金','现金券','谢谢','加息一天','特权本金'],
  	    $lotteryItem = $('.lottery-item');
  	for(var i=1; i<9; i++){
  	    prizeList[i] = {
  	        name: prizes[i-1]
  	    };
  	}
  	var rld = new RectLuckDraw('#js-rect-luck-draw-con', prizeList, {
  	    turnAroundCount: 5, 
  	    maxAnimateDelay: 400,
  	    turnStartCallback: function(){
  	        // alert('摇奖开始...')，
  	        // alert('转');
  	    },
  	    turnEndCallback: function(prizeId, obj){
  	        // alert('恭喜您中了 - ' + prizeList[prizeId].name);
            window.clearInterval($scope._timer);
  	        setTimeout(function(){
  	            alert('恭喜您中了 - ' + obj.name);
  	            $lotteryItem.addClass('selecting');
  	        },300)
  	        // alert('&nbsp;');
  	    },
  	    startBtnClick: function($btn){
  	    	//点击抽奖立即去掉奖品选中样式
  	    	$lotteryItem.removeClass('selecting');
	        if(this.isLocked()){
	            // alert('正在摇奖中...');
	            return;
	        }
	        var prizeId = 5;
	        // alert('start');
	        // 模拟掉抽奖接口。获取抽奖类型设置prizeId，确定最后停止的位置 data-prize-id:prizeId
	        // $.ajax({
	        //     url: "http://localhost:8000/hongcai/rest/cashCoupons?page=1&pageSize=10&status=1",
	        //     cache: false,
	        //     success: function(response) {
	        //         var prizeId = response.ret === -1? 3 : 0;
	        //         alert('最终奖品: ' + prizeList[prizeId].name);
	        //         rld.start(prizeId);
	        //     },
	        //     error: function(xhr) {

	        //     }
	        // });
	        rld.start(prizeId);
  	        
  	    },
  	    onLock: function(){
  	        // alert('锁上了');
  	    },
  	    onUnlock: function(obj){
  	        // alert('解锁了');
  	    }
  	});
    
  	/**
     *  幸运用户数据
     *  prizeType：1, "当日加息"" ; 2, "现金奖励 ; 3, "加息券 ; 4, "现金券" ; 5, "特权本金" ; 6, "谢谢"
    **/

    $scope.luckyUsers = angular.fromJson(localStorage.getItem('luckyUsers'))? angular.fromJson(localStorage.getItem('luckyUsers')) : undefined;
    Restangular.one('lotteries').one('luckyUsers').get().then(function(response){
      $scope.luckyUsers = response;
      localStorage.setItem('luckyUsers', angular.toJson($scope.luckyUsers));
      for(var i = 0; i <$scope.luckyUsers.length; i++) {
        var prizeType = $scope.luckyUsers[i].prizeType;
        switch(prizeType)
        {
        case 1:
          $scope.luckyUsers[i].prizeName = '+' + $scope.luckyUsers[i].value + '%当日加息';
          break;
        case 2:
          $scope.luckyUsers[i].prizeName = '返现' + $scope.luckyUsers[i].value + '元';
          break;
        case 3:
          $scope.luckyUsers[i].prizeName = '+' + $scope.luckyUsers[i].value + '%加息券';
          break;
        case 4:
          $scope.luckyUsers[i].prizeName = $scope.luckyUsers[i].value + '元现金券';
          break;
        case 5:
          $scope.luckyUsers[i].prizeName = '特权本金' + $scope.luckyUsers[i].value + '元';
          break;
        }
      }
    });
  	var luckyTimer = function(val) {
  		$rootScope.timer = setInterval(function(){
        if(val % 60 === 0) {
          val = 0;
          $('.lucky-users-wrap').find('ul').css('marginTop',val + 'rem');
          val -= 15;
          return
        }
  			$('.lucky-users-wrap').find('ul').animate({
  			  marginTop : val + 'rem'
  			  },800,function(){
  			  // $(this).css({marginTop : "0.0rem"}).find("li:first").appendTo(this);
  			});
  			val -= 15;
  		},5000);
  	}
  	luckyTimer(-15);
  })