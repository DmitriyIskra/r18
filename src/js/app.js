
// самый верхний слайдер с видео
import RedrawSlHead from "./slider-head/redrawSlHead";
import ControllSlHead from "./slider-head/controllSlHead";

// продуктовый слайдер
import ControllSlProd from "./slider-prod/controllSlProd";
import RedrawSlProd from "./slider-prod/redrawSlProd";
import sliderProdData from "../base/slider-product-top.json";
import sliderProdData2 from "../base/slider-product-bottom.json";


document.addEventListener('DOMContentLoaded', (e) => {
    
    // SLIDER HEAD
    const sliderHead = document.querySelector('.slider-h');

    if(sliderHead) {
        const redrawSlHead = new RedrawSlHead(sliderHead);
        const controllSlHead = new ControllSlHead(redrawSlHead);
        controllSlHead.init();
    }

    // Верхний продуктовый слайдер
    const sliderProd1 = document.querySelector('.products__wr-slider-top');

    if(sliderProd1) {
        const redrawSlProd = new RedrawSlProd(sliderProd1, sliderProdData);
        const controllSlProd = new ControllSlProd(redrawSlProd);
        controllSlProd.init();
    }

    // Нижний продуктовый слайдер
    const sliderProd2 = document.querySelector('.products__wr-slider-bottom');

    if(sliderProd2) {
        const redrawSlProd = new RedrawSlProd(sliderProd2, sliderProdData2);
        const controllSlProd = new ControllSlProd(redrawSlProd);
        controllSlProd.init();
    }
})
