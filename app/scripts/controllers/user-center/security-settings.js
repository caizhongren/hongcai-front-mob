'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SecuritySettingsCtrl
 * @description
 * # SecuritySettingsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('SecuritySettingsCtrl', function ($scope, $state, DEFAULT_DOMAIN, Restangular) {

    $scope.options = {
      format: 'yyyy-mm-dd', // ISO formatted date
      monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      // monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      // weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      // weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekdaysFull: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      showWeekdaysFull: true,
      showMonthsFull: true,
      today: '',
      clear: '清除',
      clise: 'cancle',
      onClose: function(e) {
        console.log(2);  
      }
    }

    $('.datepicker').pickadate({
      weekdaysShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      showMonthsShort: true
    })
  });