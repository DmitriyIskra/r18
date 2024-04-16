// Фильтр слайдера для кофе
import Filter from "./slider-coffee/filter";

// Навигация
import ControllNav from "./navigation/controllNavigation";
import RedrawNav from "./navigation/redrawNavigation";

// Мобильная навигация
import ControllNavM from "./navigation-mobile/controllNavM";
import RedrawNavM from "./navigation-mobile/redrawNavM";

// самый верхний слайдер с видео
import RedrawSlHead from "./slider-head/redrawSlHead";
import ControllSlHead from "./slider-head/controllSlHead";

// кофейный слайдер
import ControllSlСoffee from "./slider-coffee/controllSlСoffee";
import RedrawSlСoffee from "./slider-coffee/redrawSlСoffee";
import sliderCoffeeData from "../base/slider-coffee.json"

// слайдер с карточками в перспективе
import ControllSLP from "./slider-perspective/controllSlP";
import RedrawSLP from "./slider-perspective/redrawSlP";
import sliderMerchData from '../base/slider-merch.json';
import sliderAccessData from '../base/slider-accessories.json';

// SERVICE
import ControlService from "./service/controlService";
import RedrawService from "./service/redrawService";

// Кнопка прокрутки вверх
import buttonToTop from "./button-to-top/button-to-top";

// Заказы временно через контакты
import temporaryOrders from "./temporary-orders/temporary-orders";

window.addEventListener('load', () => {
    
    // SLIDER HEAD
    const sliderHead = document.querySelector('.slider-h');
    if(sliderHead) {
        const redrawSlHead = new RedrawSlHead(sliderHead);
        const controllSlHead = new ControllSlHead(redrawSlHead);
        controllSlHead.init();
    }

    // Кофейный слайдер
    const sliderCoffe1 = document.querySelector('.coffee__wr-slider-top');
    if(sliderCoffe1) {
        const filterList = sliderCoffe1.querySelector('.sl-prod__filter-list');

        const redrawSlCoffe = new RedrawSlСoffee(sliderCoffe1, sliderCoffeeData);
        const filter = new Filter(filterList);
        const controllSlCoffe = new ControllSlСoffee(redrawSlCoffe, filter);
        controllSlCoffe.init();
    }

    
    // слайдер Мерч с карточками в перспективе
    const merchSL = document.querySelector('.merch__wr-slider .sl-p');
    if(merchSL) {
        const redrawSLP = new RedrawSLP(merchSL, sliderMerchData);
        const controllSLP = new ControllSLP(redrawSLP);
        controllSLP.init();
    }

    // слайдер Аксессуары с карточками в перспективе
    const accessSL = document.querySelector('.accessories__wr-slider .sl-p');
    if(accessSL) {
        const redrawSLP = new RedrawSLP(accessSL, sliderAccessData);
        const controllSLP = new ControllSLP(redrawSLP);
        controllSLP.init(); 
    }

    // кнопка прокрутки вверх
    const buttons = document.querySelectorAll('.button-to-top');
    if(buttons.length > 0) buttonToTop(buttons);

    // Навигация в HEADER
    const naviHeader = document.querySelector('.nav');
    if(naviHeader) {
        const redrawNav = new RedrawNav(naviHeader, '.sl-prod__filter-list', sliderCoffeeData);
        const controllNav = new ControllNav(redrawNav);
        controllNav.init();
    }

    if(innerWidth <= 991) {
        // Мобильная навигация
        const ctrl = document.querySelector('.nav-mob__control-list');
        const navM = document.querySelector('.nav-mob-list');
        if(navM) {
            const redrawNavM = new RedrawNavM(ctrl, navM, sliderCoffeeData);
            const controllNavM = new ControllNavM(redrawNavM);
            controllNavM.init();
        }
    }
    
    // Навигация в FOOTER
    const naviFooter = document.querySelector('.footer nav');
    if(naviFooter) {
        const redrawNav = new RedrawNav(naviFooter);
        const controllNav = new ControllNav(redrawNav);
        controllNav.init();
    }

    // Заказы временно через контакты
    const contacts = document.querySelector('.contacts');
    const temporaryLink = document.querySelector('.orders-are-temporary a');
    if(contacts && temporaryLink) {
        temporaryOrders(temporaryLink, contacts);
    }

    // SERVICE смена карточек
    const service = document.querySelector('.service');
    if(service) {
        const redrawService = new RedrawService(service);
        const controlService = new ControlService(redrawService);
        controlService.init();
    }
})
