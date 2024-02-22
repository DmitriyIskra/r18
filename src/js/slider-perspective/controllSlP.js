export default class ControllSLP {
    constructor(d) {
        this.d = d;

        this.click = this.click.bind(this);
    }

    init() {
        this.d.initSlider();
        this.registerEvents();
    }

    registerEvents() {
        this.d.el.addEventListener('click', this.click);
    }

    click(e) {
        if(e.target.closest('.slider__arrow-next')) {
            this.d.next();
        }

        if(e.target.closest('.slider__arrow-prev')) {
            this.d.prev();
        }
    }
}