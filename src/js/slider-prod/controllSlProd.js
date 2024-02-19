export default class ControllSlProd {
    constructor(d) {
        this.d = d;

        this.click = this.click.bind(this);
    }

    init() {
        this.d.initSlider();
        this.registerEvents();
    }

    registerEvents() {
        this.d.arrow.addEventListener('click', this.click);
    }

    click() {
        this.d.move();
    }
} 