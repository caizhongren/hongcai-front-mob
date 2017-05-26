'use strict';
angular.module('p2pSiteMobApp')
  .controller('LotteryCtrl', function($scope, $rootScope, Restangular, WEB_DEFAULT_DOMAIN, CheckMobUtil, CheckPicUtil, md5, ipCookie, Utils, $timeout, DEFAULT_DOMAIN, $http, $window) {
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.busy = false;
    $scope.showDrawBox = false;
    $scope.drawed = false;
    $scope.canGetMobileCapcha = true;
    var mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    var deviceCode = Utils.deviceCode();
  	/**
  	*抽奖动画
  	**/
  	var prizeList = {},
        second = 60,
        $showDrawBox = $('.showDrawBox'),
        $lottery = $('.lottery'), 
        $mobilecode = $('#lottery-mobilecode')[0],
  	    prizes = ['当日加息','现金奖励','加息券','现金券','特权本金','谢谢','当日加息','特权本金'],
  	    $lotteryItem = $('.lottery-item');
  
  	var rld = new RectLuckDraw('#js-rect-luck-draw-con', prizeList, {
  	    turnAroundCount: 5, 
  	    maxAnimateDelay: 400,
  	    turnStartCallback: function(){
  	        //alert('摇奖开始...');
  	    },
  	    turnEndCallback: function(prizeId, obj){
            window.clearInterval($scope._timer);
            $showDrawBox.show();
            $lottery.addClass('position-fix');
            $lotteryItem.addClass('selecting');
  	    },
  	    startBtnClick: function($btn){
	        if(this.isLocked() || !$scope.drawed){
	            return;
	        }
          $scope.signUp($scope.user);
  	    },
  	    onLock: function(){
  	        // alert('锁上了');
  	    },
  	    onUnlock: function(obj){
  	        // alert('解锁了');
  	    }
  	});

    /**
    * 抽奖
    **/
    $scope.drawLottery = function() {
      if($scope.drawed){ //抽过一次
        $showDrawBox.show();
        return;
      }
      $lottery.addClass('position-fix');
      $scope.showRegister = true;
    }
    $scope.closeRegisterBox = function() {
      $scope.showRegister = false;
      $lottery.removeClass('position-fix');
    }
    /**
    * 注册
    **/
    
    // 随机生成
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    function generateMixed(n) {
        var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
    }
    $scope.showRegister = false;
    $scope.signUp = function(user) {
      var act;
      if(ipCookie('act') && !isNaN(ipCookie('act'))){
        act = ipCookie('act');
      }
      Restangular.one('users/').post('register', { 
        picCaptcha: user.picCaptcha,
        mobile: user.mobile,
        password: md5.createHash(generateMixed(7)),
        captcha: user.captcha,
        channelCode: ipCookie('utm_from'),
        act: act,
        channelParams: ipCookie('channelParams'),
        device: Utils.deviceCode(),
        guestId: ipCookie('guestId')
      }).then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
          return;
        } 
        $scope.user = response;
        $scope.drawed = true;
        $scope.showRegister = false;
        Restangular.one('lotteries/').post('draw', {
          scenetype: 1,
          userId: $scope.user.id
        }).then(function(response){
          $scope.showRegister = false;
          if(response && response.ret !== -1) {
            // $scope.lottery = response;
            var receivePrize = response;
            switch(receivePrize.prizeType){
              case 1:
                $scope.prizeList = {
                  prizeType: receivePrize.prizeType,
                  prizeText: '当日加息',
                  prizeValue: '+' + receivePrize.value + '%',
                  prizeCont: '奖励已自动生效，赶快下载App查看吧！'
                }
                break;
              case 2:
                $scope.prizeList = {
                  prizeType: receivePrize.prizeType,
                  prizeText: '返现',
                  prizeValue: receivePrize.value + '元',
                  prizeCont: '奖励已发放至您的账户，赶快下载App查看吧！'
                }
                break;
              case 3:
                $scope.prizeList = {
                  prizeType: receivePrize.prizeType,
                  prizeText: '加息券',
                  prizeValue: '+' + receivePrize.value + '%',
                  prizeCont: '奖励已发放至您的账户，赶快下载App查看吧！'
                }
                break;
              case 4:
                $scope.prizeList = {
                  prizeType: receivePrize.prizeType,
                  prizeText: '现金券',
                  prizeValue: receivePrize.value + '元',
                  prizeCont: '奖励已发放至您的账户，赶快下载App查看吧！'
                }
                break;
              case 5:
                $scope.prizeList = {
                  prizeType: receivePrize.prizeType,
                  prizeText: '(有效期1天)',
                  prizeValue: receivePrize.value + '元特权本金',
                  prizeCont: '奖励已发放至您的账户，赶快下载App查看吧！'
                }
                break;
              case 6:
                $scope.prizeList = {
                  prizeType: receivePrize.prizeType,
                  prizeText: '谢谢',
                  prizeValue: receivePrize.value,
                  prizeCont: '什么都木有赚到，换个姿势再试一次吧～'
                }
                break;

            }
            var prizeId = response.prizeType;
            rld.start(prizeId);
            return;
          }
          $rootScope.showMsg('response.msg');

        })

      })
    }
    //　倒计时
    $scope.countDown = function() {
      // 如果秒数还是大于0，则表示倒计时还没结束
      
      if (second >= 0) {
        // 倒计时不结束按钮不可点
        $scope.canGetMobileCapcha = false;
        $mobilecode.innerHTML = null;
        $mobilecode.innerHTML = second + "s";
        $mobilecode.className = 'sent';
        // 时间减一
        second -= 1;
        // 一秒后重复执行
        setTimeout(function() {
          $scope.countDown();
        }, 1000);
        // 否则，按钮重置为初始状态,可点击
      } else {
        $mobilecode.className = 'sent';
        $mobilecode.innerHTML = "重新发送";
        second = 60;
        $scope.canGetMobileCapcha = true;
      }

    }
    //校验图形验证码
    $scope.checkCapcha = function(user) {
      
      $http({
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
        },
        url: DEFAULT_DOMAIN + '/captchas/checkPic',
        data: {'captcha': user.picCaptcha}
      }).success(function(data) {
        if (data == true) {
          Restangular.one('/users/').post('mobileCaptcha', {  
            mobile: user.mobile,
            picCaptcha: user.picCaptcha,
            type: user.mobileCaptchaType,
            business: user.mobileCaptchaBusiness,
            device: Utils.deviceCode(),
            guestId: ipCookie('guestId')
          }).then(function(response) {
            if (response.ret === -1) {
              $rootScope.showMsg(response.msg);
            } else {
              if(!$scope.canGetMobileCapcha){
                return;
              }
              $scope.countDown();
            }
          });
        } else {
          $rootScope.showMsg('图形验证码错误');
        }
      }).error(function() {
        $rootScope.showMsg('图形验证码错误');
      });
    }
    //获取手机验证码
    $scope.getMobileCapcha = function(user) {
      if(!$scope.user.mobile || !$scope.user.picCaptcha){
        return;
      }
      if(!mobilePattern.test($scope.user.mobile)){
        $rootScope.showMsg('手机号码格式有误');
        return;
      }
      //校验手机号
      Restangular.one('/users/').post('isUnique', {
        account: user.mobile
      }).then(function(response) {
        if(response && response.ret === -1) {
          $rootScope.showMsg('您已是宏财用户，请前往app参与');
          return;
        }
        $scope.checkCapcha(user);
      })
    }

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
    /**
     * 虚拟键盘弹出遮住输入框问题
     */
     if(deviceCode ===  2 || deviceCode === 3) {
        angular.element('.picCaptcha').bind({
          focus: function(){
            angular.element('.register-box').css('margin-top','-6rem');
          },
          blur: function(){
            angular.element('.register-box').css('margin-top','-5rem');
          }
        })
        angular.element('.mobileCaptcha').bind({
          focus: function(){
            angular.element('.register-box').css('margin-top','-6rem');
          },
          blur: function(){
            angular.element('.register-box').css('margin-top','0rem');
          }
        })
     }
    
  	var luckyTimer = function(val) {
  		$rootScope.timer = setInterval(function(){
        if(val % 75 === 0) {
          val = 0;
          $('.lucky-users-wrap').find('ul').css('marginTop', '0rem');
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