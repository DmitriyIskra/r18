export default class ControllSlСoffee {
    constructor(d) {
        this.d = d;

        this.click = this.click.bind(this);
        this.touchMoove = this.touchMoove.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }

    init() {
        this.d.initSlider();
        this.registerEvents();
    }

    registerEvents() {
        this.d.slider.addEventListener('click', this.click);
        this.d.wrSlides.addEventListener('touchstart', this.touchStart, {passive: true});
        this.d.wrSlides.addEventListener('touchmove', this.touchMoove, {passive: true});
        this.d.wrSlides.addEventListener('touchend', this.touchEnd, {passive: true});
    }

    click(e) {
        if(e.target.closest('.slider__arrow-next')) {
            this.d.moveNext();
        }

        if(e.target.closest('.slider__arrow-prev')) {
            this.d.movePrev();
        }
    }

    touchStart(e) {
        this.d.touchStart(e.changedTouches[0].clientX);
    }

    touchMoove(e) {
        this.d.swipe(e.changedTouches[0].clientX);
    }

    touchEnd(e) {
        this.d.touchEnd(e.changedTouches[0].clientX);
    }
} 