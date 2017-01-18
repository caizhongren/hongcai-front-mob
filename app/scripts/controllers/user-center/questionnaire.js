'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('QuestionnaireCtrl', function($state, $timeout, Restangular, $scope, $rootScope) {

  	//风险测评题目详情:
  	Restangular.one('/users/' + '0' + '/getQuestionnaire' ).get({
  		'surveyType': 1
  	}).then(function(response){
  		$scope.questionnaires = response.questionnaires;
  	})
  	$scope.answerJson = {};
  	$scope.select = function(question_id,answer_id){
  		$('#'+answer_id).siblings().removeClass('active');
  		$('#'+answer_id).addClass('active');
  		$scope.answerJson[question_id] = answer_id;
  		console.log($scope.answerJson);
  		if (!$scope.answerJson) {
  			$('.submit-btn').addClass('button-disabled1');
  		}else {
  			$('.submit-btn').removeClass('button-disabled1');
  		}
  	}

  	$scope.submitForm = function(){

  		if($scope.errMsg || $scope.showMsk || !$scope.answerJson){
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
  				if(response.score >= 22 && response.score <= 40){
  					$scope.riskTolerance = '一般'
  				}else if(response.score >= 41 && response.score <= 55){
  					$scope.riskTolerance = '较强'
  				}else if(response.score >= 56 && response.score <= 70){
  					$scope.riskTolerance = '很强'
  				}else {
  					$scope.riskTolerance = '超赞'
  				}
  				if(response.score < 35){
  					$scope.riskPreference = '保守型'
  				}else if(response.score >= 35 && response.score <= 59){
  					$scope.riskPreference = '稳健型'
  				}else if(response.score > 59){
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
