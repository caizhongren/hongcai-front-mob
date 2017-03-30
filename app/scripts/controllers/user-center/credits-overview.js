'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # CreditsOverviewCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('CreditsOverviewCtrl', function ($scope, $state, DEFAULT_DOMAIN, Restangular) {

    $scope.totalInvestAmount = 0;
    $scope.investStat = {
      selection: 0,
      hornor:0,
      assignment:0,
      holdingAmount: 0
    }

    $scope.showOther =false;

    /**
    * 所有投资查询
    **/
    Restangular.one('/users/0/investments/typeStat').get({}).then(function(response){
      if(!response || response.ret == -1){
        return;
      }
      $scope.investStat.holdingAmount = 0;
      for(var i = 0;i<response.length;i++) {
        var stat = response[i];
        $scope.investStat.holdingAmount = $scope.investStat.holdingAmount+ stat.holdingAmount;
        if(stat.creditRightType == 7){
           $scope.investStat.selection = stat.holdingAmount;
        } else if(stat.creditRightType == 8) {
          $scope.investStat.hornor = stat.holdingAmount;
        } else if (stat.creditRightType == 6) {
          $socpe.investStat.assignment = stat.holdingAmount;
        } else if(stat.creditRightType == 3){
          $scope.showOther = true;
        }

      }
      /**
      * 画环形图
      **/
      var circle = {
            cx : 155,    //圆心的x轴坐标值
            cy : 115,    //圆心的y轴坐标值
            r : 105 ,     //圆的半径
            lineWidth:20  //环形宽度
          };
      var colors = ['#2b8bf1','#0460cd','#ffaa25'];
      var ctx = $('#huanxing')[0].getContext('2d');
      var start = 0;
      var end = 0;
      ctx.font ='21px Microsoft yahei';
      ctx.textAlign = 'left';
      ctx.fillStyle = "#666";
      ctx.fillText('在投金额', 110, 100 );
      ctx.fillStyle = "#ff5400";  
      for(var i = 0; i < colors.length;i++) {
          start = end;
          //项目在投都为0，环形三分
          if($scope.investStat.holdingAmount == 0){
            var percent = 1/3;
            end = percent * Math.PI*2 + start;
          }else{
            if(i == 0) {
              end = $scope.investStat.selection/$scope.investStat.holdingAmount* Math.PI*2 + start;
            }
            if(i == 1) {
              end = ($scope.investStat.hornor)/$scope.investStat.holdingAmount* Math.PI*2 + start;
            }
            if(i == 2) {
              end = ($scope.investStat.assignment)/$scope.investStat.holdingAmount* Math.PI*2 + start;
            }
          }
          
        ctx.beginPath();

        // 给曲线设定颜色
        ctx.strokeStyle = colors[i];

        // 画出曲线
        ctx.arc(circle.cx, circle.cy, circle.r, start, end, false);
        //设定曲线粗细度
        ctx.lineWidth = circle.lineWidth;
        //给曲线着色
        ctx.stroke();

        ctx.closePath();
      }


   });
    
});
