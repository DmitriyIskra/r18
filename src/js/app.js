import { dataHead } from "../data/data-sl_video"; 

import RedrawSlHead from "./slider-head/redrawSlHead";
import ControllSlHead from "./slider-head/controllSlHead";

document.addEventListener('DOMContentLoaded', (e) => {
    
    // SLIDER HEAD
    const sliderHead = document.querySelector('.slider-h');

    if(sliderHead) {
        const redrawSlHead = new RedrawSlHead(sliderHead, dataHead);
        const controllSlHead = new ControllSlHead(redrawSlHead);
        controllSlHead.init();
    }
})
