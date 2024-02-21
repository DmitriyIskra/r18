export default class RedrawSLP {
    constructor(el) {
        this.el = el;
        this.arrows = this.el.querySelectorAll('.slider__arrow');
        this.cardDecoL = this.el.querySelectorAll('.sl-p__slide-item_l');
        this.cardDecoR = this.el.querySelectorAll('.sl-p__slide-item_r');
        this.cards = this.el.querySelectorAll('.sl-p__slide-item');

        this.prevCard = null;
        this.activeCard = null;
        this.nextCard = null;
    }

    initSlider() {
        // показываем стрелки
        this.arrows.forEach(item => {
            item.style = 'display: block;';
        });

        this.cards.forEach((item, index) => {
            // скрываем лишние карточки
            if(index > 2) item.style.display = 'none';

            switch (index) {
                case 0:
                    this.prevCard = item; // назначить классы динамически уже через переменные
                break;
                case 1:
                    this.activeCard = item;
                break;
                case 2:
                    this.nextCard = item;
            }
        })
    }

    next() {

    }
}