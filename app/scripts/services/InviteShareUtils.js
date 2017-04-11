'use strict';
angular.module('p2pSiteMobApp')
  .factory('InviteShareUtils', function($rootScope, Restangular, SessionService, config) {
    return {

      share : function(){
        var title = this.shareTitle();
        var subTitle = this.shareSubtitle();
        var linkUrl = this.shareLink();
        var imageUrl = this.shareImageUrl();

        var shareItem = {
          title : title,
          subTitle : subTitle,
          linkUrl : linkUrl,
          imageUrl : imageUrl
        };

        return shareItem;
      },

      //标题
      shareTitle : function(){
        var titleArray = [];
        
        titleArray.push('加入“宏财合伙人计划” ，一起发宏财！');
        titleArray.push('有一张10%的加息券正向你飞来，快接住！');
        titleArray.push('朋友！收下这份大礼，你就是我的人了！');
        titleArray.push('这四海八荒的财运，我都攒到一起送给你啦！');
        titleArray.push('10%新人加息券来了，手快有手慢无！');
        titleArray.push('一个好汉三个帮，理财就上宏财网！');

        return titleArray[Math.floor(Math.random() * titleArray.length)];
      },

      //副标题
      shareSubtitle : function(){
        var subTitle = '新手立享10%加息特权，再送炫目大礼包！国资背景+银行存管，上宏财，财运来！';

        return subTitle;
      },

      //分享链接
      shareLink : function(){
        var shareLink = config.domain + '/activity/invite-sharing' ;
        
        if(SessionService.isLogin()){
            //邀请码
          $scope.voucher = Restangular.one('users/0').one('voucher').get().$object;

          if($scope.voucher.inviteCode){
            shareLink = shareLink + '/'  + $scope.voucher.inviteCode;
          }

          shareLink = shareLink + '?act=22&f=officeweb';
        }
        
        return shareLink;
      },

      //图片链接
      shareImageUrl : function(){
        var imageUrl = 'https://mmbiz.qlogo.cn/mmbiz_jpg/8MZDOEkib8AlesZAUd6woODtlJbnNpuQHYibUasRbts0teKicv4JpcggcOVxvMvI32ASyw42VoPv04aZvYQdgicmKw/0?wx_fmt=jpeg';

        return imageUrl;
      }

    };
  });
