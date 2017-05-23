'use strict';
angular.module('p2pSiteMobApp')
  .controller('LotteryCtrl', function($scope, $rootScope) {
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

  	

  	var luckyTimer = function(val) {
  		setInterval(function(){
			$('.lucky-users-wrap').find('ul').animate({
			  marginTop : val + 'rem'
			  },500,function(){
			  // $(this).css({marginTop : "0.0rem"}).find("li:first").appendTo(this);
			});
  			val = val - 14;
  		},1000);
  	}
  	// luckyTimer(-14);
  })