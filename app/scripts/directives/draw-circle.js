'use strict';

/**
 * @ngdoc directive
 * @name drawing
 * @description
 * # ngFocus
 */
angular.module('p2pSiteMobApp')
  .directive('drawCircle', function() {
  return {
    restrict: 'A',
    link : function(scope, element) {
        	var circle = {
		        cx : 155,    //圆心的x轴坐标值
		        cy : 115,    //圆心的y轴坐标值
		        r : 105 ,     //圆的半径
		        lineWidth:20
		    };
		    var data = scope.data;
			var ctx = element[0].getContext('2d');
			var start = 0;
		    var end = 0;
		    ctx.font ='21px Microsoft yahei';
		    ctx.textAlign = 'left';
		    ctx.fillStyle = "#666";
	        ctx.fillText('在投金额', 110, 100 );
	        // ctx.fillText(1+'元', 110, 130 );
	        ctx.fillStyle = "#ff5400";
			for (var i = data.length - 1; i >= 0; i--) {
		    	start = end;
		    	end = data[i].percentage* Math.PI*2 + start;

		    	ctx.beginPath();
		    	//绘制图例
		        // ctx.fillStyle=data[i].color;
		        // ctx.fillRect(15,15+18*i,15,15);

				// 给曲线设定颜色
				ctx.strokeStyle = data[i].color;

				// 画出曲线
				ctx.arc(circle.cx, circle.cy, circle.r, start, end, false);
				
				//设定曲线粗细度
				ctx.lineWidth = circle.lineWidth;
				//给曲线着色
				ctx.stroke();

				ctx.closePath();
		    }
	    }
	  };
  });
