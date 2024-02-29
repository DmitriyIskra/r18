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

        if(e.target.closest('.sl-p__size-item')) {
            this.d.choosingSize(e.target.closest('.sl-p__size-item'));
        }

        if(e.target.closest('.sl-p__card-slider-pag-item')) {
            const el = e.target.closest('.sl-p__card-slider-pag-item');
            const index = +el.dataset.num;
            this.d.mooveCardSlider(index);
        }

        if(e.target.closest('.sl-p__card-slider-color-item')) {
            const list = e.target.closest('.sl-p__card-slider-color-list');
            const article = list.dataset.article
            const el = e.target.closest('.sl-p__card-slider-color-item');
            const id = el.id;
            const color = el.dataset.color;
            this.d.changeColor(id, color, article);
        }
    }
}