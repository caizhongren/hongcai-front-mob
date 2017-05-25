'use strict';
angular.module('p2pSiteMobApp')
  .controller('LotteryCtrl', function($scope, $rootScope, Restangular, $window) {
  	/**
  	*抽奖动画
  	**/
  	var prizeList = {}, 
  	    prizes = ['当日加息','现金奖励','加息券','现金券','特权本金','谢谢','当日加息','特权本金'],
  	    $lotteryItem = $('.lottery-item'),
        $showDrawBox = $('.showDrawBox'),$receiveDraw = $('.receive-draw'),
        $lottery = $('.lottery');
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
              $showDrawBox.show();
               $receiveDraw.show();
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
	        var prizeId = Math.floor(Math.random()*6+1);
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
          switch(prizeId){
            case 1:
              $scope.prizeList = {
                prizeType: prizeId,
                prizeText: '当日加息',
                prizeValue: '+' + prizeId + '%',
                prizeCont: '奖励已自动生效，成功为您加息！'
              }
              break;
            case 2:
              $scope.prizeList = {
                prizeType: prizeId,
                prizeText: '返现',
                prizeValue: prizeId + '元',
                prizeCont: '奖励已发放至您的账户，前往“我的”页面即可查看！'
              }
              break;
            case 3:
              $scope.prizeList = {
                prizeType: prizeId,
                prizeText: '加息券',
                prizeValue: '+' + prizeId + '%',
                prizeCont: '奖励已发放至您的账户，前往“我的-加息券”即可查看！'
              }
              break;
            case 4:
              $scope.prizeList = {
                prizeType: prizeId,
                prizeText: '现金券',
                prizeValue: prizeId + '元',
                prizeCont: '奖励已发放至您的账户，前往“我的-现金券”即可查看！'
              }
              break;
            case 5:
              $scope.prizeList = {
                prizeType: prizeId,
                prizeText: '(有效期1天)',
                prizeValue: prizeId + '元特权本金',
                prizeCont: '奖励已发放至您的账户，前往“我的-特权本金”即可查看！'
              }
              break;
            case 6:
              $scope.prizeList = {
                prizeType: prizeId,
                prizeText: '谢谢',
                prizeValue: 0,
                prizeCont: '什么都木有赚到，换个姿势再试一次吧～'
              }
              break;
          }
          if ($scope.prizeList.prizeType) {
            rld.start(prizeId);
          }
	        
  	        
  	    },
  	    onLock: function(){
  	        // alert('锁上了');
  	    },
  	    onUnlock: function(obj){
  	        // alert('解锁了');
  	    }
  	});

    /**
     *  今日可抽奖次数
    **/
    $scope.getDrawCount = function() {
      if (!$rootScope.isLogged) {
        return;
      }
      Restangular.one('lotteries').one('drawCount').get().then(function(response){
        if (response && response.ret !== -1) {
          $scope.drawCount = response;
        }else {
          $scope.drawCount = 0;
        }
      })
    }
    $scope.getDrawCount();

  	/**
     *  幸运用户数据
     *  prizeType：1, "当日加息"" ; 2, "现金奖励 ; 3, "加息券 ; 4, "现金券" ; 5, "特权本金" ; 6, "谢谢"
    **/
    $scope.luckyUsers = angular.fromJson(localStorage.getItem('luckyUsers'))? angular.fromJson(localStorage.getItem('luckyUsers')) : undefined;
    $scope.getLuckyUsers = function() {
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
    }
    $scope.getLuckyUsers();

    /**
     *  关闭中奖弹窗
    **/
    $scope.closeDrawBox = function() {
      $showDrawBox.hide();
      $receiveDraw.hide();
      $lottery.removeClass('position-fix');
    }
 
    /**
     *  关闭活动规则弹窗
    **/ 
    $scope.showRuleBox = false;
    $scope.closeRuleBox = function() {
      $scope.showRuleBox = !$scope.showRuleBox;
      if ($scope.showRuleBox) {
        $lottery.addClass('position-fix');
      }else {
        $lottery.removeClass('position-fix');
      }
    }
    /**
     *  下载app
     **/
    $scope.downloadApp = function() {
      $window.location.href = ' http://a.app.qq.com/o/simple.jsp?pkgname=com.hoolai.hongcai';
    }

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