export default class RedrawNav {
    constructor(el) {
        this.el = el;
        this.itemsNav = [...this.el.querySelectorAll('.nav__item')];
        this.itemsPoints = [];
    }

    initNav() {
        this.itemsNav.forEach(item => {
            const flag = item.dataset.item
            const el = document.querySelector(`.${flag}`);
            this.itemsPoints.push(el);
        })
    }

    scrolling(flag) {
        const el = this.itemsPoints.find(item => item.matches(`.${flag}`));

        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        })        
    }
}