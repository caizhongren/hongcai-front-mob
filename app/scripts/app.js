/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */
define([
    'angular',
    'uiRouter',
    'ngAnimate',
    'ngTouch',
    'ngFameApp',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'
], function (ng) {
    'use strict';
    return ng.module('p2psitemob', [
        'p2psitemob.services',
        'p2psitemob.controllers',
        'p2psitemob.filters',
        'p2psitemob.directives',
        'ui.router',
        // 'ngFameApp',
        'ngAnimate',
        'ngTouch'
    ]);
});
