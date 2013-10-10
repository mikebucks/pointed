/*!
* @directive `ng-sticky`
*
* @description Add position: fixed; when element is scrolled to the top of the browser window.
*
* @param `sticky-offset` Pixel value to offset the sticky element from the top of the window. Default 0.
* @param `sticky-index` Integer to support multiple stickies on a single view. Also adds z-index of sticky-index + 5. You only need this if you have multiple pt-sticky instances on a single page.
*
* @example (.html):
* <div pt-sticky sticky-offset="50">...</div>
*/

angular.module('pt.sticky', []).directive('ptSticky', 
  ['$rootScope', function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, el, attr, ctrl) {
        var el_height, el_width, $dummy_sticky, el_position,
          $window = $(window),
          minWidth = 767,
          stickyOffset = parseInt(attr.stickyOffset, 10) || 0,
          scrolling = false,
          resizing = false;

        $rootScope.$on('$routeChangeSuccess', watchWindow);

        // Insert dummy elements to preserve layout after original becomes fixed
        el.clone().empty().addClass('dummy-sticky').addClass('dummy-'+attr.stickyIndex).insertBefore(el);
        $dummy_sticky = $('.dummy-'+attr.stickyIndex);

        var watchWindow = function() {
          if ($('.dummy-sticky').length >= 1) {
            $window.scroll(function() { scrolling = true; });
            $window.resize(function() { resizing = true; });
          } else {
            $window.unbind('scroll');
            $window.unbind('resize');
          }
        };

        var addSticky = function() {
          $dummy_sticky.css({
            'width'  : el_width,
            'height' : el_height
          });
          el.addClass('fixed').css({
            'top'     : stickyOffset,
            'left'    : el_position.left,
            'width'   : el_width,
            'z-index' : attr.stickyIndex+5 || 5
          });
        };

        var removeSticky = function() {
          el.removeClass('fixed').removeAttr('style');
          $dummy_sticky.css({ 'width' : 0, 'height': 0 });
        };

        // Scroll/Resize event runs every 50 ms. Any slower and the stickiness feels clunky.
        setInterval(function() {
          if (scrolling || resizing) {
            el_position = $dummy_sticky.offset();
            el_height = el.innerHeight();
            el_width = el.width();
            scrolling = false;
            resizing = false;

            try {
              // no sticky on mobile
              if ($window.width() <= minWidth) {
                removeSticky();
                return;
              // wide screen sticky
              } else if ($window.scrollTop()+stickyOffset >= el_position.top && el.height() <= $window.height()) {
                addSticky();
              // kill sticky
              } else {
                removeSticky();
              }
            } catch(err) {
              console.log('Pointed Sticky Directive Error: ' + err);
              return;
            }
          }
        }, 50);

        watchWindow();
      }
    };
  }
]);