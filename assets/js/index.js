$('.arrow-wrap').click(function() {
  $('html, body').animate({
    scrollTop: $('main').offset().top - 32
  }, 500);
  return false;
});
