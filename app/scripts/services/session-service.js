'use strict';
/**
 * session相关服务
 */
angular.module('p2pSiteMobApp')
  .factory('SessionService', function($http, $location, Utils, Restangular) {
    return {
      set: function(key, value) {
        return sessionStorage.setItem(key, value);
      },
      get: function(key) {
        return sessionStorage.getItem(key);
      },

      /**
       * 退出登录，清除session
       */
      destory: function() {
        Restangular.one('users/0/').post('logout', {
          device: Utils.deviceCode(),
          isWeixin: Utils.isWeixin()
        }).then(function(response) {
        });
        sessionStorage.setItem('isLogin', 'false');
        return sessionStorage.removeItem('user');
      },

      /**
       * 登录成功，将user相关信息放入session storage中
       */
      loginSuccess: function(user){
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('lastCheckTime', new Date().getTime() + '');
        return sessionStorage.setItem('user', angular.toJson(user));
      },

      /**
       * 获取session中用户信息
       */
      getUser: function(){
      	this.checkSession();
        return sessionStorage.getItem('user') ?  angular.fromJson(sessionStorage.getItem('user')) : undefined;
      },

      /**
       * 是否登录
       */
      isLogin: function(){
      	this.checkSession();
        return sessionStorage.getItem('isLogin') === 'true';
      },

      /**
       * 如果用户已实名认证，则缓存
       */
      setUserAuthIfAuthed: function(userAuth){
        if(userAuth && userAuth.authStatus == 2){
          sessionStorage.setItem('userAuth', angular.toJson(userAuth));
        }
      },

      getUserAuth: function(){
      	this.checkSession();
        return sessionStorage.getItem('userAuth') ?  angular.fromJson(sessionStorage.getItem('userAuth')) : undefined;
      },

      checkSession: function(){
      	var lastCheckTime = sessionStorage.getItem('lastCheckTime') ? sessionStorage.getItem('lastCheckTime') : 0;
      	if(new Date().getTime() - Number(lastCheckTime) > 20 * 60 * 1000){
      		sessionStorage.setItem('isLogin', 'false');
      		sessionStorage.removeItem('user');
      		sessionStorage.removeItem('userAuth');
      	} else {
      		sessionStorage.setItem('lastCheckTime', new Date().getTime() + '');
      	}
      }

    };
  });