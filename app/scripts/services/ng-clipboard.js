/*
* @Author: fuqiang1
* @Date:   2016-09-28 09:57:07
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-28 10:28:01
*/

'use strict';
angular.module('p2pSiteMobApp').factory('ngClipboard', function($compile,$rootScope,$document) {
      return {
        toClipboard: function(element){

        var copyElement = angular.element('<span id="ngClipboardCopyId">'+element+'</span>');
        var body = $document.find('body').eq(0);
        body.append($compile(copyElement)($rootScope));

        var ngClipboardElement = angular.element(document.getElementById('ngClipboardCopyId'));
        // console.log(ngClipboardElement);
        var range = document.createRange();

        range.selectNode(ngClipboardElement[0]);

        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        var successful = document.execCommand('copy');

        var msg = successful ? 'successful' : 'unsuccessful';
        // console.log('Copying text command was ' + msg);
        window.getSelection().removeAllRanges();

        copyElement.remove();
    }
  }
})
