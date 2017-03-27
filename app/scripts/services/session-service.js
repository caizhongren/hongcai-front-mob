'use strict';
/**
 * session相关服务
 */
angular.module('p2pSiteMobApp')
  .factory('SessionService', function($http, $location, DEFAULT_DOMAIN, restmod, Utils) {
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
        var logoutModel = restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/logout');
        logoutModel.$create({
          device: Utils.deviceCode(),
          isWeixin: Utils.isWeixin()
        }).$then(function(response) {
        });
        sessionStorage.setItem('isLogin', 'false');
        return sessionStorage.removeItem('user');
      },

      /**
       * 登录成功，将user相关信息放入session storage中
       */
      loginSuccess: function(user){
        sessionStorage.setItem('isLogin', 'true');
        return sessionStorage.setItem('user', angular.toJson(user));
      },

      /**
       * 获取session中用户信息
       */
      getUser: function(){
        return sessionStorage.getItem('user') ?  angular.fromJson(sessionStorage.getItem('user')) : undefined;
      },

      /**
       * 是否登录
       */
      isLogin: function(){
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
        return sessionStorage.getItem('userAuth') ?  angular.fromJson(sessionStorage.getItem('userAuth')) : undefined;
      }
    };
  });