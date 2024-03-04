export default class ControllNav {
    constructor(d) {
        this.d = d;

        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();
        this.d.initNav();
    }

    registerEvents() {
        this.d.el.addEventListener('click', this.click);
    }

    click(e) {
        e.preventDefault();
        
        if(e.target.closest('.nav__item')) {
            const el = e.target.closest('.nav__item');
            const flag = el.dataset.item;
            this.d.scrolling(flag);
        }
    }
}