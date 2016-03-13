'use strict';
angular.module('hongcaiApp').directive('ensureCaptcha', ['$http', 'DEFAULT_DOMAIN', function($http, DEFAULT_DOMAIN) {
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			scope.$watch(attrs.ngModel, function() {
				$http({
					method: 'POST',
					url: DEFAULT_DOMAIN + '/siteUser/checkPicCaptcha?captcha=' + angular.element('#' + attrs.ensureCaptcha).val()
				}).success(function(data) {
					if(data.ret === 1) {
						ctrl.$setValidity('check', true);
					} else {
						ctrl.$setValidity('check', false);
					}
				}).error(function() {
					ctrl.$setValidity('check', false);
				});
			});
		}
	};
}]);
