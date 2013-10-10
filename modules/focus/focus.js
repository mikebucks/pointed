/*
    focus an input on view render. only use one per page.
    @usage 
    <input type="text" ng-focus />

*/
angular.module('pt.focus').directive('ptFocus', [
  function() {
    return {
      restrict: 'A',
      link: function($scope, el, attr) {
        el.focus();
      }
    };
  }
]);