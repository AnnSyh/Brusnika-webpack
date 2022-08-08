import './css/plugins/bootstrap-grid.min.scss'; 
import './css/plugins/tooltipster.bundle.min.css'; 
import './css/plugins/slick.css'; 
import './css/plugins/magnific-popup.css'; 
import './css/plugins/datepicker.min.css?v=797191'; 

// import './css/plugins/project.css'; 
// import './css/plugins/project-ann.css?v=797191'; 
// import './css/plugins/project.responsive.css?v=724611'; 
// import './css/plugins/project.responsive-ann.css?v=724611'; 

import './scss/index.scss'; 
// require('file-loader!./index.pug');

const numbers = [2, 3, 5];

// Стрелочная функция. Не запнётся ли на ней Internet Explorer?
const doubledNumbers = numbers.map(number => number * 2);

console.log(doubledNumbers); // 4, 6, 10 