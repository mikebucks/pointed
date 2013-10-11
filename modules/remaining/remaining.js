/*!
 * @directive `remaining`
 * @description character count for text field
 */

angular.module('pt.remaining', []).directive('ptRemaining', function () {
  return {
    template: "{{remaining}} characters",
    scope: {
      maxLen: '@max',
      model: '=ngModel'
    },
    link: function(scope, elem, attrs) {
      scope.$watch('model', function(val) {
        if (val === null || val === undefined) return;

        var maxLen = parseInt(scope.maxLen, 10);
        var remaining = maxLen - val.length;
        if (remaining < 0)
          scope.model = val.substr(0, maxLen);
        else
          scope.remaining = remaining; 
      });
    }
  };
});