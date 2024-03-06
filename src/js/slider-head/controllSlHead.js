export default class ControllSlHead {
    constructor(d) {
        this.d = d
        this.slider = d.slider;
        this.initSlider = d.initSlider;

        this.click = this.click.bind(this);
    }

    init() { 
        this.d.initSlider();
        this.d.slider.addEventListener('click', this.click);
    }

    click(e) { 
        // NEXT клик по стрелке
        if(e.target.closest('.slider__arrow-next')) {
           this.d.moveNext();
        }

        // PREV клик по стрелке
        if(e.target.closest('.slider__arrow-prev')) {
            this.d.movePrev();
        }

        if(e.target.closest('.slider-h__pagination-item')) {
            this.d.clickPag(e.target.closest('.slider-h__pagination-item'));
        }
    }
}