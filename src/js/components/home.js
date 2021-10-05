/*global Flickity */

import { templates, select } from '../settings.js';


class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidget();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};

    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

    thisHome.dom.order = document.querySelector(select.home.order);
    thisHome.dom.bookTable = document.querySelector(select.home.bookTable);
  }

  initWidget() {
    const thisHome = this;

    thisHome.element = document.querySelector(select.home.carousel);

    thisHome.flkty = new Flickity(thisHome.element, {
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      autoPlay: true,
    });
  }

  //goPage(){
  //const thisHome = this;

  //thisHome.dom.order.addEventListener('click', function(){
        
  //})
  //}
}
export default Home;