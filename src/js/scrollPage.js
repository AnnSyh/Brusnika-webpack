
window.addEventListener('scroll', function () {
  const cardNav = $('.card-nav');
  cardNav.hide(); // убрать меню при загрузке стр

  if ($(window).scrollTop() > 400) {
    cardNav.show();
    // console.log('scrollTop() > 400');
  }
  else {
    cardNav.hide();
    // console.log('scrollTop() <= 400');
  }
});

const simplebarsList = document.querySelectorAll('.simplebar');
console.log('simplebarsList = ', simplebarsList);

simplebarsList.forEach((item) => {
  new SimpleBar(item,{
    autoHide:false,
  });
})