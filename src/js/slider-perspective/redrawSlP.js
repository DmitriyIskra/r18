export default class RedrawSLP {
    constructor(el) {
        this.el = el;
        this.arrows = this.el.querySelectorAll('.slider__arrow');
        this.cardDecoL = this.el.querySelector('.sl-p__slide-item_l');
        this.cardDecoR = this.el.querySelector('.sl-p__slide-item_r');
        this.itemsList = this.el.querySelector('.sl-p__slides-list')
        this.items = this.el.querySelectorAll('.sl-p__slide-item');
        this.cards = this.el.querySelectorAll('.sl-p__card');

        this.prevCard = null;
        this.activeCard = null;
        this.nextCard = null;

        this.duration = 0.35;
        this.timeF = 'linear';
    }
 
    initSlider() {
        // показываем стрелки
        this.arrows.forEach(item => {
            item.style.display = 'block';
        });

        this.cards.forEach((item, index) => {
            // Добавляем анимацию активным карточкам внутри item
            if(index < 3) {
                this.setTransitionCard(item);
            }
        })

        this.items.forEach((item, index) => {
            item.style.transition = `
            left ${this.duration}s ${this.timeF},
            transform ${this.duration}s ${this.timeF},
            opacity  ${this.duration}s ${this.timeF}`;

            // скрываем лишние карточки
            if(index > 2) item.style.opacity = '0';

            // определяем слайды и их классы
            switch (index) {
                case 0:
                    this.prevCard = item;
                    this.prevCard.classList.add('sl-p__slide-item_prev');
                break;
                case 1:
                    this.activeCard = item;
                    this.activeCard.classList.add('sl-p__slide-item_active');
                break;
                case 2:
                    this.nextCard = item;
                    this.nextCard.classList.add('sl-p__slide-item_next');
            }
        })
    }

    next() {
        // находим следующий элемент определяем его положение
        // добавляем анимацию и перемещаем
        const nextEl = this.nextCard.nextElementSibling;
        nextEl.classList.add('sl-p__slide-item_next-r');
        setTimeout(() => {
            this.setTransitionCard(nextEl.firstElementChild);
            nextEl.classList.remove('sl-p__slide-item_next-r');
            nextEl.classList.add('sl-p__slide-item_next');
        })
        
        // смещаем next в активе
        this.nextCard.classList.remove('sl-p__slide-item_next');
        this.nextCard.classList.add('sl-p__slide-item_active');

        // смещаем active в prev
        this.activeCard.classList.remove('sl-p__slide-item_active');
        this.activeCard.classList.add('sl-p__slide-item_prev');

        // смещаем prev в prev-l
        this.prevCard.classList.remove('sl-p__slide-item_prev');
        this.prevCard.classList.add('sl-p__slide-item_prev-l');

        nextEl.addEventListener('transitionend', () => {
            this.prevCard.classList.remove('sl-p__slide-item_prev-l');
            this.prevCard.firstElementChild.style.transition = '';
            this.cardDecoR.before(this.prevCard);
     
            this.prevCard = this.activeCard;
            this.activeCard = this.nextCard;
            this.nextCard = nextEl;

            // Обновляем массив items
            this.items = this.el.querySelectorAll('.sl-p__slide-item');
        }, {once: true})
    }

    prev() {
        const prevEl = this.items[this.items.length - 1];
        this.cardDecoL.after(prevEl);
        prevEl.classList.add('sl-p__slide-item_prev-l');
        setTimeout(() => {
            this.setTransitionCard(prevEl.firstElementChild);
            prevEl.classList.remove('sl-p__slide-item_prev-l');
            prevEl.classList.add('sl-p__slide-item_prev');
        })

        // смещаем prev на active
        this.prevCard.classList.remove('sl-p__slide-item_prev');
        this.prevCard.classList.add('sl-p__slide-item_active');

        // смещаем active в prev
        this.activeCard.classList.remove('sl-p__slide-item_active');
        this.activeCard.classList.add('sl-p__slide-item_next');

        // смещаем next в активе
        this.nextCard.classList.remove('sl-p__slide-item_next');
        this.nextCard.classList.add('sl-p__slide-item_next-r');

        prevEl.addEventListener('transitionend', () => {
            this.nextCard.classList.remove('sl-p__slide-item_next-r');
            this.nextCard.firstElementChild.style.transition = '';
     
            this.nextCard = this.activeCard;
            this.activeCard = this.prevCard;
            this.prevCard = prevEl;

            // Обновляем массив items
            this.items = this.el.querySelectorAll('.sl-p__slide-item');
        }, {once: true})
    }

    setTransitionCard(el) {
        el.style.transition = `
        transform ${this.duration}s ${this.timeF},
        height ${this.duration}s ${this.timeF},
        width ${this.duration}s ${this.timeF},
        box-shadow ${this.duration}s ${this.timeF}`;
    }
}