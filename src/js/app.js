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

// DELIVERY
import ControllDelivery from "./delivery/ControllDelivery";
import RedrawDelivery from "./delivery/RedrawDelivery";

// ACCOUNT BUTTON
import ControllAccountButton from "./accountButton/ControllAccountButton";
import RedrawAccountButton from "./accountButton/RedrawAccountButton";
import ApiAccountButton from "./accountButton/ApiAccountButton";


// BASKET BUTTON
import ControllBasketButton from "./basketButton/ControlBasketButton";
import RedrawBasketButton from "./basketButton/RedrawBasketButton";

// PLACE ORDER
import ControllPlaceOrder from "./place-order/controllPlaceOrder";
import RedrawPlaceOrder from "./place-order/redrawPlaceOrder";

// АССOUNT PAGE
import ControllAccount from "./account/ControllAccount";
import RedrawTypeContent from "./account/RedrawTypeContent";
import RedrawAccountProfile from "./account/RedrawAccountProfile";
import RedrawHistory from "./account/RedrawHistory";

// CHANGE PASSWORD
import ControllChangePassword from "./changePassword/ControllChangePassword";
import RedrawChangePassword from "./changePassword/RedrawChangePassword";
import ApiChangePassword from "./changePassword/ApiChangePassword";
import ValidationChangePassword from "./changePassword/ValidationChangePassword";



// AIR DATAPICKER (для account)
import AirDatepicker from "air-datepicker";

// IMASK
import IMask from "imask";





window.addEventListener('load', () => {
    
    // SLIDER HEAD
    const sliderHead = document.querySelector('.slider-h');
    if(sliderHead) {
        const redrawSlHead = new RedrawSlHead(sliderHead);
        const controllSlHead = new ControllSlHead(redrawSlHead);
        controllSlHead.init();
    }

    // АССOUNT BUTTON ВХОД - РЕГИСТРАЦИЯ
    const accButton = document.querySelector('.header__account');
    if(accButton) {
        const redraw = new RedrawAccountButton(accButton);
        const api = new ApiAccountButton();
        const controll = new ControllAccountButton(redraw, IMask, api);
        controll.init();
    }

    // CHANGE PASSWORD
    const changePassword = document.querySelector('.change-pass');
    if(changePassword) {
        const redraw = new RedrawChangePassword(changePassword);
        const api = new ApiChangePassword();
        const validation = new ValidationChangePassword();
        const controll = new ControllChangePassword(redraw, api, validation);
        controll.init();
    }

    // BASKET
    const basket = document.querySelector('.header__basket');
    let controllBasket;
    if(basket) {
        const mobileBasket = document.querySelector('.nav-mob__item[data-item="basket"]')
        
        const redraw = new RedrawBasketButton(basket, mobileBasket);
        controllBasket = new ControllBasketButton(redraw, IMask);
        controllBasket.init();
    }

    // ОФРМЛЕНИЕ ЗАКАЗА
    const placeOrder = document.querySelector('.place-order__wr-data');
    if(placeOrder) {
        const redraw = new RedrawPlaceOrder(placeOrder);
        const controll = new ControllPlaceOrder(redraw);
        controll.init();
    }

    // ACCOUNT PAGE
    const account = document.querySelector('.account'); 
    if(account) {
        const redrawTypeContent = new RedrawTypeContent(account)

        const profile = account.querySelector('.account__profile');
        const redrawProfile = new RedrawAccountProfile(profile);

        const history = account.querySelector('.account__history');
        const redrawHistory = new RedrawHistory(history);

        const redraw = {
            content : redrawTypeContent,
            profile : redrawProfile,
            history : redrawHistory,
        }

        const controll = new ControllAccount(redraw, AirDatepicker, IMask);
        controll.init(); 
    }

    // Кофейный слайдер
    const sliderCoffe1 = document.querySelector('.coffee__wr-slider-top');
    if(sliderCoffe1) {
        const filterList = sliderCoffe1.querySelector('.sl-prod__filter-list');

        const redrawSlCoffe = new RedrawSlСoffee(sliderCoffe1, sliderCoffeeData);
        const filter = new Filter(filterList);
        const controllSlCoffe = new ControllSlСoffee(redrawSlCoffe, filter, controllBasket.addToBasket);
        controllSlCoffe.init();
    }

    
    // слайдер МЕРЧ с карточками в перспективе
    const merchSL = document.querySelector('.merch__wr-slider .sl-p');
    if(merchSL) {
        const redrawSLP = new RedrawSLP(merchSL, sliderMerchData);
        const controllSLP = new ControllSLP(redrawSLP, controllBasket.addToBasket);
        controllSLP.init();
    }

    // слайдер АКСЕССУАРЫ с карточками в перспективе
    const accessSL = document.querySelector('.accessories__wr-slider .sl-p');
    if(accessSL) {
        const redrawSLP = new RedrawSLP(accessSL, sliderAccessData);
        const controllSLP = new ControllSLP(redrawSLP, controllBasket.addToBasket);
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

    // DELIVERY
    const delivery = document.querySelector('.delivery');
    if(delivery && innerWidth <= 1200) {
        const redraw = new RedrawDelivery(delivery, 'delivery__controll-item_active', 'delivery__direction_active');
        const controll = new ControllDelivery(redraw);
        controll.init();
    }
})



