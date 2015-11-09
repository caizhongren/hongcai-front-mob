'use strict';

/**
 * @ngdoc service
 * @name o2oWechatIou.register
 * @description
 * # register
 * Service in the o2oWechatIou.
 */
angular.module('p2pSiteMobApp')
  .service('register1', function (restmod, DEFAULT_DOMAIN) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model(DEFAULT_DOMAIN + '/desireUsers/register');
  });
