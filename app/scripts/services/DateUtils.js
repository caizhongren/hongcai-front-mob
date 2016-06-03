'use strict';
angular.module('p2pSiteMobApp')
  .factory('DateUtils', function() {
    return {

      /**
       * 在开始时间的基础上，加上多少个月份
       * @param {long} startTimeInLong 开始时间，long型
       * @param {int} addMonth        增加的月份值
       */
      addMonth: function(startTimeInLong, addMonth){
      var startDate = new Date(startTimeInLong);
      var startYear = startDate.getFullYear();
      var startDay = startDate.getDate();
      var startMonth = startDate.getMonth();

      startDate.setDate(1);
      if (startMonth + addMonth > 11){
        startDate.setFullYear(startYear + 1);
        startDate.setMonth(startMonth + addMonth - 12);
      } else {
        startDate.setMonth(startMonth + addMonth);
      }

      var monthDays = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
      startDay = startDay > monthDays ? monthDays : startDay;

      startDate.setDate(startDay);

      return startDate.getTime();
    },

    intervalMonths: function(time1, time2) { 
        var date1 = new Date(time1); 
        var date2 = new Date(time2);

        return Math.abs(date1.getFullYear() * 12 + date1.getMonth() - date2.getFullYear() * 12 - date2.getMonth());
    },
    


    intervalDays: function(time1, time2) { 

        return (Math.abs(Math.floor((time2 - time1)/ (24 * 60 * 60 * 1000))) + 1) * (time2 > time1 ? 1 : -1);
    }
    


  };
  });
