export default class RedrawSLP {
    constructor(el, data) {
        this.el = el;
        this.data = data;
        this.arrows = this.el.querySelectorAll('.slider__arrow');
        this.cardDecoL = this.el.querySelector('.sl-p__slide-item_l');
        this.cardDecoR = this.el.querySelector('.sl-p__slide-item_r');
        this.itemsList = null;
        this.items = null;
        this.cards = this.el.querySelectorAll('.sl-p__card');

        this.prevCard = null;
        this.activeCard = null;
        this.nextCard = null;

        this.duration = 1;
        this.timeF = 'linear';
    }
 
    initSlider() {
        // перебираем json и элементы вставляем this.cardDecoR.before(...)
        // и там уже для элемента определяем все что в this.items.forEach(
        // в конце initSlider определяем this.list и this.items

        // Формируем карточки
        this.data.forEach((item, index) => {
            const el = this.createCard(item);
            el.style.transition = `
            left ${this.duration}s ${this.timeF},
            transform ${this.duration}s ${this.timeF},
            opacity  ${this.duration}s ${this.timeF}`;

            switch (index) {
                case 0:
                    this.prevCard = el;
                    this.prevCard.classList.add('sl-p__slide-item_prev');
                break;
                case 1:
                    this.activeCard = el;
                    this.activeCard.classList.add('sl-p__slide-item_active');
                break;
                case 2:
                    this.nextCard = el;
                    this.nextCard.classList.add('sl-p__slide-item_next');
            }

            this.cardDecoR.before(el);
        })

        // заполняем переменные актуальной информацией
        this.itemsList = this.el.querySelector('.sl-p__slides-list');
        this.items = this.el.querySelectorAll('.sl-p__slide-item');

        this.cards.forEach((item, index) => {
            // Добавляем анимацию активным карточкам внутри item
            if(index < 3) {
                this.setTransitionCard(item);
            }
        })

        // показываем стрелки
        this.arrows.forEach(item => {
            item.style.display = 'block';
        });
    }

    createCard(data) {
        const item = document.createElement('li');
        item.classList.add('sl-p__slide-item');

        const card = document.createElement('div');
        card.classList.add('sl-p__card');

        const mask = document.createElement('div');
        mask.classList.add('sl-p__card-mask');

        card.append(mask);
        item.append(card)

        return item;
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
        }, {once: true})
    }

    prev() {
        const prevEl = this.cardDecoR.previousElementSibling;
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