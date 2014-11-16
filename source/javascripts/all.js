//= require "jquery"
//= require "jquery.scrollTo"

$(function() {
  var marginTop = 0;
  var slides = $('.slide');
  var mouseDown = false;
  var didScroll = false;

  /**
  * Install in/out methodology into jQuery easing library.
  */
  $.easing.easeInOut = function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  };

  /**
  * Scrolls the page to the next H2 tag.
  */
  function scrollBy(dir, time) {
    var bestOffset,
      bestIndex = 0,
      scrollTop = $(window).scrollTop() + marginTop,
      offset;
  
    slides.each(function(index, el) {
      offset = Math.abs( $(el).offset().top - scrollTop );
      if ( isNaN(bestOffset) || offset < bestOffset ) {
        bestOffset = offset;
        bestIndex = index;
      }
    });
  
    bestIndex = Math.max( 0, Math.min(bestIndex+dir, slides.length-1) );
  
    if (bestIndex >= 0 && bestIndex < slides.length) {
      $.scrollTo(slides[bestIndex], time, {
        offset:{left:0, top:-marginTop},
        easing:'easeInOut'
      });
    }
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }


  $(window)
    .keydown(function(evt) {
      if (evt.which === 38) {
        evt.preventDefault();
        scrollBy(-1, 1000);
      } else if (evt.which === 40) {
        evt.preventDefault();
        scrollBy(1, 1000);
      }
    })
    .mousedown(function() {
      mouseDown = true;
    })
    .mouseup(function() {
      if (didScroll) scrollBy(0, 500);
      mouseDown = false;
      didScroll = false;
    })
    .scroll(function() {
      if (mouseDown) didScroll = true;
    })
    .on('resize mousewheel', debounce(function() {
      scrollBy(0, 500);
    }, 400));
});