'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SafeCtrl
 * @description
 * # SafeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('SafeCtrl', function ($scope) {
    $scope.safes = [
    {name: '资金保障', eName: 'Project Safeguard', title: '安全的模式，丰富的产品', content: '专注于P2F模式的互联网金融机构，和正规银行、证券、保险、基金、担保等多个多类金融机构合作，通过分散用户的投资到多个机构的多个产品中去，达到降低风险的目的。', fa: 'fa-jpy'},
    {name: '资金托管', eName: 'Funds Manage', title: '易宝支付资金托管，避免资金池', content: '宏财网在银监会监管政策出台之前严格自律，所有资金全部由第三方易宝支付进行资金托管，避免资金池。此外，宏财网还采用先进的安全保护技术和完善的安全监测系统，对数据实时进行备份，用6层架构的代码防篡改技术来为用户保驾护航，避免客户资料丢失。在发现网站有非正常访问时，系统会及时作出安全响应。', fa: 'fa-briefcase'},
    {name: '风控体系', eName: 'Risk Control System', title: '美国FICO结合三亿大数据', content: '宏财网由美国FICO结合三亿大数据独创宏财信用评价模型。并采用“提前履约+风险备付金+抵押担保”模式，对项目进行线下尽职调查并且实时监控，全面确保客户权益。', fa: 'fa-bell'},
    {name: '法律支持', eName: 'Legal Support', title: '中国法学会理事专业领队', content: '由中国法学会理事蔡曙涛领队的专业律师团队严格控制贷后风险，全面确保客户的法律权益。', fa: 'fa-gavel'}
    ];



  });
