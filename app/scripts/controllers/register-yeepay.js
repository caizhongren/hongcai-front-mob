'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterYeepayCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterYeepayCtrl', ['$rootScope','$scope', '$state', '$stateParams', 'md5', 'registerYeepay', 'HongcaiUser', 'config', function ($rootScope, $scope, $state, $stateParams, md5, registerYeepay, HongcaiUser, config) {
    var userId = $stateParams.userId;
    if (!userId) {
      $state.go('root.main');
    }
    HongcaiUser.$find('checkSession').$then(function(response) {
      if (response.id) {
        // 用户在url上输入一个错误的userId
        if (userId != response.id ) {
          $state.go('root.main');
        } else if (response.email) {
          // 该用户已经绑定
          $state.go('root.main');
        }
      } else {
        // 绑定超时
        $state.go('root.main');
      }
    });
    function newForm() {
      var f = document.createElement('form');
      document.body.appendChild(f);
      f.method = 'post';
      // f.target = '_blank';
      return f;
    }

    function createElements(eForm, eName, eValue) {
      var e = document.createElement('input');
      eForm.appendChild(e);
      e.type = 'text';
      e.name = eName;
      if (!document.all) {
        e.style.display = 'none';
      } else {
        e.style.display = 'block';
        e.style.width = '0px';
        e.style.height = '0px';
      }
      e.value = eValue;
      return e;
    }


    // 注册易宝POST
    $scope.signUpYeepay = function(user) {
      registerYeepay.$create({email: user.email,realName: user.realName,idCardNo: user.idCardNo}).$then(function(response){
        if (response.ret === -1) {
          $scope.msg = response.msg;
          console.log($scope.msg);
        } else {
          var sign = response.sign;
          var req = response.req;
          console.log(sign,req);
          var _f = newForm();
          createElements(_f, 'req', req);
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toRegister';
          _f.submit();
        }
      });
    };

  }]);
