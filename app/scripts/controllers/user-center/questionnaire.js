'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('QuestionnaireCtrl', function($location, $state, $timeout, Restangular, $scope, $rootScope) {
  	
    if ($location.path().split('/')[2] === 'questionnaire') {
	    $rootScope.showFooter = false;
	  }
  	//风险测评题目详情:
  	Restangular.one('/users/' + '0' + '/getQuestionnaire' ).get({
  		'surveyType': 1
  	}).then(function(response){
  		$scope.questionnaires = response;
  	})
  	$scope.answerJson = {};
  	$scope.select = function(question_id,answer_id){
  		$('#'+answer_id).siblings().removeClass('active');
  		$('#'+answer_id).siblings().children('span').removeClass('selected');
  		$('#'+answer_id).addClass('active');
  		$('#'+answer_id).children('span').addClass('selected');
  		$scope.answerJson[question_id] = answer_id;
  		if (!$scope.answerJson) {
  			$('.submit-btn').addClass('button-disabled1');
  		}else {
  			$('.submit-btn').removeClass('button-disabled1');
  		}
  	}

  	$scope.submitForm = function(){

  		if($scope.errMsg || $scope.showMsk || $.isEmptyObject($scope.answerJson)){
  			return;
  		}
  		Restangular.one('/users/0').post('questionnaire',{
  			'surveyType':1,
    		'answerJson':$scope.answerJson
  		}).then(function(response){
  			if (response.ret == -1) {
  				$scope.errMsg = response.msg;
  				$timeout(function() {
  					$scope.errMsg = '';
  				},2000)
  			}else {
  				$scope.showMsk = true;
  				if(response >= 22 && response <= 40){
  					$scope.riskTolerance = '一般'
  				}else if(response >= 41 && response <= 55){
  					$scope.riskTolerance = '较强'
  				}else if(response >= 56 && response <= 70){
  					$scope.riskTolerance = '很强'
  				}else {
  					$scope.riskTolerance = '超赞'
  				}
  				if(response < 35){
  					$scope.riskPreference = '保守型'
  				}else if(response >= 35 && response <= 59){
  					$scope.riskPreference = '稳健型'
  				}else if(response > 59){
  					$scope.riskPreference = '进取型'
  				}
  				
  			}
  		})
  	}

  	$scope.closeMsk = function(){
  		$scope.showMsk = false;
  		$state.go('root.userCenter.setting');
  	}

    
  });
