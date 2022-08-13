
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

$(".order-table-delete").on("click", function (e) {
  e.preventDefault();
  const parent = e.target.parentNode.parentNode
  parent.classList.toggle('d-none');
});


$(".search-form__clear").on("click", function (e) {
  e.preventDefault();
  const parent = e.target.parentNode
  console.log('search-form__clear ', parent);
  // parent.classList.toggle('d-none');
});

const dimensionsList = document.querySelectorAll('.check-dimensions-list a');

dimensionsList.forEach((item) => {
  console.log('dimensionsList');
  item.addEventListener('click', (e) => {
    console.log('click');
    e.preventDefault();
    const item = e.target
    item.classList.toggle('active');
  });

});

// $("button.basket-open").on("click", function (e) {
//   e.preventDefault();
//   const item = e.target
//   item.classList.toggle('active');
// });

$('#catalog-basket').on("click", function (e) {
  e.preventDefault();
  const item = e.target
  item.classList.toggle('active');
});


const simplebarsList = document.querySelectorAll('.simplebar');
console.log('simplebarsList = ', simplebarsList);

simplebarsList.forEach((item) => {
  new SimpleBar(item,{
    autoHide:false,
  });
})

$('.sms-not-coming').on("click", function (e) {
  console.log('sms-not-coming');
  e.preventDefault();
  window.location='login.html';
  const tabs = document.querySelectorAll('.sign-with');

  tabs.forEach((item)=>{
    console.log('111item.classList = ', item.classList);
    // (data-tab="#auth-form_phone") 
  });
   
});


// сделать при клике окрашивание границы в черный и появление подсписка

const radiosList = document.querySelectorAll('.basket-form .form-item--radio');
console.log('radiosList = ', radiosList);

radiosList.forEach((item) => {
  item.addEventListener('click', (e) => {
    const row = e.target.parentNode.parentNode.parentNode.parentNode;

    // очистить от класса .black-border   все эл-ты списка

    console.log('item3 = ', row.classList.add('black-border'));
    // console.log('item3 = ', row.classList.toggle('black-border'));
  });
})

