export default class ControllSlСoffee {
    constructor(d, filter) {
        this.d = d;
        this.filter = filter;

        this.click = this.click.bind(this);
        this.touchMoove = this.touchMoove.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }

    init() {
        this.d.initSlider();
        this.registerEvents();

        // отрисовка кнопок фильтра
        const data = new Map();
        this.d.data.forEach(item => data.set(item.packing, item['filter-name']));
        this.filter.rendering(data);
    }

    registerEvents() {
        this.d.slider.addEventListener('click', this.click);
        this.d.wrSlides.addEventListener('touchstart', this.touchStart, {passive: true});
        this.d.wrSlides.addEventListener('touchmove', this.touchMoove, {passive: true});
        this.d.wrSlides.addEventListener('touchend', this.touchEnd, {passive: true});
    }

    click(e) {
        e.preventDefault();

        if(e.target.closest('.slider__arrow-next')) {
            this.d.moveNext();
        }

        if(e.target.closest('.slider__arrow-prev')) {
            this.d.movePrev();
        }

        if(e.target.closest('.sl-prod__filter-type')) {
            this.filter.setActive(
                e.target.closest('.sl-prod__filter-type'),
                this.d.renderingWithFilter.bind(this.d)
            );
        }

        if(e.target.closest('.sl-prod__filter-reset')) {
            this.filter.resetActive(
                this.d.renderingWithFilter.bind(this.d)
            );
        }

        if(e.target.closest('.sl-prod__button-slide')) {
            this.d.scrollToContacts();
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