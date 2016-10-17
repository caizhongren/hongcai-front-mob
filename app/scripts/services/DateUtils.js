'use strict';
angular.module('p2pSiteMobApp')
  .factory('DateUtils', function() {
    return {

      /**
       * 在开始时间的基础上，加上多少个月份
       * @param {long} startTimeInLong 开始时间，long型
       * @param {int} addMonth        增加的月份值
       */
      addMonth: function(startTimeInLong, addMonth) {
        var startDate = new Date(startTimeInLong);
        var startYear = startDate.getFullYear();
        var startDay = startDate.getDate();
        var startMonth = startDate.getMonth();

        startDate.setDate(1);s
        if (startMonth + addMonth > 11) {
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

        return (Math.abs(Math.floor((time2 - time1) / (24 * 60 * 60 * 1000))) + 1) * (time2 > time1 ? 1 : -1);
      },


      toHourMinSeconds: function(intervalTimeInMills) {
        var date = new Date(intervalTimeInMills - 8 * 60 * 60 * 1000);
        var dateStr = date.toTimeString().substring(0, 8);

        var time = {};
        time.hour = dateStr.substring(0, 2);
        time.min = dateStr.substring(3, 5);
        time.seconds = dateStr.substring(6, 8);

        var hours = Math.floor(intervalTimeInMills / (60 * 60 * 1000));
        if (hours >= 24) {
          time.hour = hours;
        }

        return time;
      },

      toDayHourMinSeconds: function(intervalTimeInMills) {
        var date = new Date(intervalTimeInMills - 8 * 60 * 60 * 1000);
        var dateStr = date.toTimeString().substring(0, 8);

        var time = {};
        time.day = Math.floor(intervalTimeInMills / (24 * 60 * 60 * 1000));
        time.hour = dateStr.substring(0, 2);
        time.min = dateStr.substring(3, 5);
        time.seconds = dateStr.substring(6, 8);

        return time;
      }


    };
  });
