
// Навигация
import ControllNav from "./navigation/controllNavigation";
import RedrawNav from "./navigation/redrawNavigation";

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

// Кнопка прокрутки вверх
import buttonToTop from "./button-to-top/button-to-top";

window.addEventListener('load', () => {
    
    // SLIDER HEAD
    const sliderHead = document.querySelector('.slider-h');
    if(sliderHead) {
        const redrawSlHead = new RedrawSlHead(sliderHead);
        const controllSlHead = new ControllSlHead(redrawSlHead);
        controllSlHead.init();
    }

    // Верхний кофейный слайдер
    const sliderCoffe1 = document.querySelector('.coffee__wr-slider-top');

    if(sliderCoffe1) {
        const redrawSlCoffe = new RedrawSlСoffee(sliderCoffe1, sliderCoffeeData);
        const controllSlCoffe = new ControllSlСoffee(redrawSlCoffe);
        controllSlCoffe.init();
    }

    // Нижний кофейный слайдер
    // const sliderCoffe2 = document.querySelector('.coffee__wr-slider-bottom');

    // if(sliderCoffe2) {
    //     const redrawSlCoffe = new RedrawSlСoffee(sliderCoffe2, sliderCoffeeData2);
    //     const controllSlCoffe = new ControllSlСoffee(redrawSlCoffe);
    //     controllSlCoffe.init();
    // }

    
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
    const button = document.querySelector('.button-to-top');
    if(button) buttonToTop(button);

    // Навигация в хедере
    const naviHeader = document.querySelector('.nav');
    if(naviHeader) {
        const redrawNav = new RedrawNav(naviHeader);
        const controllNav = new ControllNav(redrawNav);
        controllNav.init();
    }

    // Навигация в футуре
    const naviFooter = document.querySelector('.footer nav');
    if(naviFooter) {
        const redrawNav = new RedrawNav(naviFooter);
        const controllNav = new ControllNav(redrawNav);
        controllNav.init();
    }
})
