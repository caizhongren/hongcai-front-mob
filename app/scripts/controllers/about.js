'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AboutCtrl',['$scope',function ($scope) {
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '宏财简介',
    }, {
      title: '战略伙伴',
    }, {
      title: '顾问团队',
    }];
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };


    // 顾问团队
    /*jslint es5: true */
    $scope.consultants = [
      {name: '邓艳芳', img: 'images/head/head-1.png', title: '（项目资产评估顾问）', introduction: '高级会计师，财政部金融企业国有资产评估项目评审专家，IACVA国际企业价值评估分析师协会（中国）教育委员会副主任委员。专注于金融资产评估，对金融企业评估有丰富的经验，谙熟金融企业运作模式。'},
      {name: '杜莹芬', img: 'images/head/head-2.png', title: '（项目财务评估顾问）', introduction: '中国社会科学院工业经济研究所研究员，财务与会计研究室主任，中国企业管理研究会常务理事，中国社会科学院研究生院教授、博士生导师，全国企业管理现代化创新成果审定委员会专家组成员。主要研究方向为企业管理、财务管理、企业并购与重组。'},
      {name: '蔡曙涛', img: 'images/head/head-4.png', title: '（经济法学顾问）', introduction: '北京大学教授、北京大学国家高新区发展战略研究院副院长、中国法学会北京经济法学研究会常任理事。曾经于1996年，获北京大学 GE China （中国通用）教学优秀奖 。1997年，获北京大学年度教学优秀奖。'},
      {name: '刘丽文', img: 'images/head/head-3.png', title: '（高级流程优化顾问）', introduction: '清华大学经济管理学院教授、博士生导师。主要研究领域为企业生产与运作管理、供应链管理、JIT和精益生产、物流管理、服务管理、工业工程。 \
刘丽文教授曾于1989年4月至1991年7月在日本东京日中经济法律中心做研究员，1993年1月至7月在加拿大西安大略大学商学院做访问学者，1999 年10月至2000年1月在日本名古屋工业大学系统工程系做研究员，2001年3月至7月在美国华盛顿大学奥林商学院做访问学者，2004年9月至10月在日本中央大学科学与工程研究生院工业及系统工程系做客座教授。目前兼任清华大学现代管理研究中心研究员。'}
    ];

    // 宏财简介
    // TODO 没有采用这个方法的原因是组织架构不是一个统一的循环展示格式，包含图片。
    // $scope.hongcaiIntr = [
    //   {fa: '', title: '成立背景', eTitle: '', content: ''},
    //   {fa: '', title: '业务范围', eTitle: '', content: ''},
    //   {fa: '', title: '组织架构', eTitle: '', content: ''}
    // ];

    // 战略伙伴
    $scope.partners = [
      {name: '政府支持', eName: 'Government Support', fa: 'fa-university', title: '工信部下设网站战略合作伙伴', introduction: '宏财网与工信部下设中国中小企业信息网（www.sme.gov.cn）达成战略合作协议。成为首个与中小企业信息网合作的互联网金融平台'},
      {name: '媒体合作', eName: 'Media Cooperation', fa: 'fa-bullhorn', title: '四大门户网站合作伙伴', introduction: '宏财网与新浪、搜狐、网易、腾讯等门户网站进行合作并进行相关业务洽谈。'},
      {name: '商务伙伴', eName: 'Bussiness Partners', fa: 'fa-bullhorn', title: '优质金融机构，易宝支付，天畅律师', introduction: '宏财网只与最优质的金融机构合作，资金托管由易宝支付进行托管，并与天畅律师事务所达成战略合作协议。全面确保客户资金安全。'}
    ];

  }]);

