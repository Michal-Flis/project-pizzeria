import {
  select,
  classNames,
  templates
} from '../settings.js';
import { utils } from  '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;


    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.randerInMenu();
    thisProduct.getElements();
    thisProduct.initAccordian();
    thisProduct.initOrderFrom();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();


  }

  randerInMenu() {
    const thisProduct = this;
    // generated HTML based on template 
    const generatedHTML = templates.menuProduct(thisProduct.data);
    // create element using utils.createDOMFromHTML
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    // find menu container
    const menuContainer = document.querySelector(select.containerOf.menu);
    // add element to menu
    menuContainer.appendChild(thisProduct.element);

  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordian() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    // const clickableTrigger = document.querySelector(select.menuProduct.clickable);
    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function (event) {
      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if (activeProduct !== thisProduct.element && activeProduct !== null) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderFrom() {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });
    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);

    let price = thisProduct.data.price;

    for (let paramId in thisProduct.data.params) {

      const param = thisProduct.data.params[paramId];

      for (let optionId in param.options) {

        const option = param.options[optionId];

        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {

          if (!option.default); {

            price += option.price;
          }
        } else {

          if (option.default); {

            price -= option.price;
          }
        }
        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          } else if (!optionSelected) {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;

    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('update', function () {
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
    // app.cart.add(thisProduct);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.data.price,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams()
    };
    return productSummary;
  }
  prepareCartProductParams() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      params[paramId] = {
        label: param.label,
        options: {}
      };

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }

    return params;
  }
}

export default Product;