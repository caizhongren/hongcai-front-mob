/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({

    paths: {
        'domReady': '../bower_components/requirejs-domready/domReady',
        'angular': '../bower_components/angular/angular',
        "uiRouter": "../bower_components/angular-ui-router/release/angular-ui-router",
        "ngAnimate": "../bower_components/angular-animate/angular-animate.min",
        "ngTouch": "../bower_components/angular-touch/angular-touch.min",
        "ngFameApp": "../bower_components/famous-angular/dist/famous-angular.min"
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'uiRouter':{
            deps: ['angular']
        }
    },
    
    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
