'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('disclosureCtrl', function($scope, $stateParams, $rootScope, Restangular) {
    setTimeout(function() {
      $('.slide').swipeSlide({
        autoSwipe : true,
        axisX : true,
        continuousScroll:true,
        speed : 1500,
        transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
        firstCallback : function(i,sum,me){
            me.find('.dot').children().first().addClass('cur');
        },
        callback : function(i,sum,me){
            me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
        }
      });
    }, 100);
    window.onscroll = function () {
      var t = document.documentElement.scrollTop || document.body.scrollTop
      if (t >= 130) {
        $('.tab').addClass('fixed')
      } else {
        $('.tab').removeClass('fixed')
      }
    }
    $scope.tab = parseInt($stateParams.tab) || 0;
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '备案信息',
    }, {
      title: '风险管理',
    }, {
      title: '组织信息',
    }, {
      title: '经营信息'
    }, {
      title: '政策法规'
    }];
    $scope.toggle.switchTab = function(tabIndex) {
      if ($scope.toggle.activeTab !== tabIndex) {
        $scope.toggle.activeTab = tabIndex
        window.scrollTo(0, 0)
      }
      if ($scope.toggle.activeTab === 3) {
        $('.column').addClass('transition-left')
      }
      if ($scope.toggle.activeTab === 1) {
        $('.column').removeClass('transition-left')
      }
      if ($scope.toggle.activeTab === 2) {
        $('.column').hasClass('transition-left') ? $('.columns').removeClass('transition-left') : $('.column').addClass('transition-left')
      }
      $scope.toggle.activeTab = tabIndex;
    };
    $scope.toggle.switchTab($scope.tab);

    $scope.businessInfo = [
      {
        name: '公司名称',
        content: '北京竞财投资服务有限公司'
      },
      {
        name: '公司简称',
        content: '北京竞财；竞财'
      },
      {
        name: '统一社会信用代码',
        content: '91110107330246732H'
      },
      {
        name: '公司注册资本',
        content: '1000万'
      },
      {
        name: '公司实缴资本',
        content: '1300万'
      },
      {
        name: '公司注册地',
        content: '北京市工商行政管理局石景山分局'
      },
      {
        name: '公司经营地',
        content: '北京市朝阳区天辰东路7号国家会议中心北区4层'
      },
      {
        name: '公司成立时间',
        content: '2015年01月23日'
      },
      {
        name: '公司经营期限',
        content: '至2035年01月22日'
      },
      {
        name: '公司经营状态',
        content: '开业'
      },
      {
        name: '公司法定代表人',
        content: '刘刚'
      },
      {
        name: '公司经营范围',
        content: '投资咨询；投资管理；资产管理；财务咨询（不得开展审计、验资、查账、评估、会计咨询、代理记账等需经专项审批的业务，不得出具相应的审计报告、验资报告、查账报告、评估报告等文字材料）；项目投资；企业管理咨询；公关策划；经济信息咨询；市场调查'
      }
    ];
    $scope.profilesTab = 0;
    $scope.businessTabs = [
      {
        profilesName: '年龄分布'
      },
      {
        profilesName: '学历分布'
      }
    ];
    $scope.switchBusinessTab = function (index) {
      if ($scope.profilesTab !== index) {
        $scope.profilesTab = index
      }
    }

    $scope.cumulative = {
      amount: 0, // 累计交易总额
      numOfTransactions: 0, // 累计交易笔数
      userCount: 0, // 累计注册会员数
      investingTotalLoanAmount: 0, // 借贷余额
      investingNumOfTransactions: 0, // 待还借款笔数
      numOfLends: 0, // 累计出借人数
      numOfBorrows: 0, // 累计借款人数
      currentNumOfLends: 0, // 当前出借人数
      currentNumOfBorrows: 0, // 当前借款人数
      lastMonthTotalLoanAmount: 0, // 上个月借贷余额
      sumTenTopLoanBalance: 0, // 上个月前十大借款人待还金额
      topLoanBalance: 0 // 上月最大单一借款人待还金额
    };

    Restangular.one('systems').one('dataStat').get({
    }).then(function(response){
      if(response && response.ret !== -1) {
        $scope.cumulative = response
      }
    })

    $scope.getUpdateDate = function (year, month) {
      var newYear = year // 取当前的年份
      var newMonth = month - 1 // 取上一个月的第一天，方便计算（最后一天不固定
      if (month <= 1) {
        newMonth += 12 // 月份增
        newYear -= 1 // 年份减
      }
      var newDate = new Date(newYear, newMonth, 1) // 取当年当月中的第一天
      var day = (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate() // 获取当月最后一天日期
      $scope.updateDate = (newYear + '-' + (newMonth < 10 ? '0' + newMonth : newMonth) + '-' + day)
    }
    $scope.getUpdateDate(new Date().getFullYear(), new Date().getMonth() + 1)

    $scope.policiesList = [
      {
        title: '网络借贷信息中介机构业务活动管理暂行办法'
      },
      {
        title: '中国银监会办公厅关于印发网络借贷资金存管业务指引的通知'
      },
      {
        title: '中国银监会办公厅关于印发网络借贷信息中介机构业务活动信息披露指引的通知'
      },
      {
        title: '网络借贷信息中介机构业务活动管理暂行办法'
      },
      {
        title: '网络借贷信息中介机构业务活动管理暂行办法'
      },
      {
        title: '中国银监会办公厅关于印发网络借贷资金存管业务指引的通知'
      },
      {
        title: '中国银监会办公厅关于印发网络借贷信息中介机构业务活动信息披露指引的通知'
      },
      {
        title: '网络借贷信息中介机构业务活动管理暂行办法'
      }
    ]

});
