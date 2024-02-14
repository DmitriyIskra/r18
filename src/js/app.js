import dataSliderHead from "../base/sliderHead";
import RedrawSlHead from "./slider-head/redrawSlHead";
import ControllSlHead from "./slider-head/controllSlHead";

document.addEventListener('DOMContentLoaded', (e) => {
    
    // SLIDER HEAD
    const sliderHead = document.querySelector('.slider-h');

    if(sliderHead) {
        const redrawSlHead = new RedrawSlHead(sliderHead);
        const controllSlHead = new ControllSlHead(redrawSlHead);
        controllSlHead.init();
    }
})
