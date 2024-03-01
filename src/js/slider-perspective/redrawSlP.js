export default class RedrawSLP {
    constructor(el, data) {
        this.el = el;
        this.data = data;
        this.arrows = this.el.querySelectorAll('.slider__arrow');
        this.cardDecoL = this.el.querySelector('.sl-p__slide-item_l');
        this.cardDecoR = this.el.querySelector('.sl-p__slide-item_r');
        this.itemsList = null;
        this.items = null;
        this.cards = null;this.el.querySelectorAll('.sl-p__card');

        this.inSideSliders = this.el.querySelectorAll('.sl-p__card-wr-slider');

        this.prevCard = null;
        this.activeCard = null;
        this.nextCard = null;

        this.activeCardSlider = null;
        this.activeCardSlidesList = null;
        this.activePaginationList = null;
        this.activeColorPag = null;

        this.activeSize = null;

        this.duration = 0.5;
        this.timeF = 'linear';
    }
 
    initSlider() {
        // перебираем json и элементы вставляем this.cardDecoR.before(...)
        // и там уже для элемента определяем все что в this.items.forEach(
        // в конце initSlider определяем this.list и this.items

        // Формируем карточки
        this.data.forEach((item, index) => {
            const el = this.patternCard(item);
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

        this.cards = this.el.querySelectorAll('.sl-p__card');

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

        // находим список размеров и определяем активный
        this.findActiveSize();

        // определяем активный внутренний слайдер
        this.findActiveCardSlider();
    }

    patternCard(data) {
        const item = document.createElement('li');
        item.classList.add('sl-p__slide-item');

        const card = document.createElement('div');
        card.classList.add('sl-p__card');

        // слайдер внутри карточки
        const wrInSlider = document.createElement('div');
        wrInSlider.classList.add('sl-p__card-wr-slider');
        wrInSlider.style = `
        transition: width ${this.duration}s ${this.timeF},
            height ${this.duration}s ${this.timeF}
        `;

        const wrInSliderList = document.createElement('div');
        wrInSliderList.classList.add('sl-p__card-wr-slides');
        const inSliderList = document.createElement('ul');
        inSliderList.classList.add('sl-p__card-slides-list');
        inSliderList.style.transition = `
            transform ${this.duration}s ${this.timeF},
            opacity ${this.duration / 1.2}s ${this.timeF}
        `;
        inSliderList.style.width = `${data.black.img.length * 100}%`;
        data.black.img.forEach(item => {
            const inSliderItem = document.createElement('li');
            inSliderItem.classList.add('sl-p__card-slides-item');
            const inSliderImg = document.createElement('img');
            inSliderImg.classList.add('sl-p__card-slides-img');
            inSliderImg.src = item;

            inSliderItem.append(inSliderImg);
            inSliderList.append(inSliderItem);
        });

        const inSliderPaginationList = document.createElement('ul');
        inSliderPaginationList.classList.add('sl-p__card-slider-pag-list');
        for(let i = 0; i < data.black.img.length; i += 1) {
            const inSliderPaginationItem = document.createElement('li');
            inSliderPaginationItem.classList.add('sl-p__card-slider-pag-item');
            inSliderPaginationItem.dataset.num = i;
            if(i === 0) 
                inSliderPaginationItem.classList.add('sl-p__card-slider-pag-item_active');
            inSliderPaginationList.append(inSliderPaginationItem);
        }
        const inSliderPaginationItem = document.createElement('li');
        inSliderPaginationItem.classList.add('sl-p__card-slider-pag-item');
        
        const colorList = document.createElement('ul');
        colorList.dataset.article = data.article;
        colorList.classList.add('sl-p__card-slider-color-list');
        data.colors.forEach((item, index) => {
            const colorItem = document.createElement('li');
            colorItem.classList.add('sl-p__card-slider-color-item');
            colorItem.id = `color${index}`; // для поиска и смены цвета кружочка
            colorItem.dataset.color = item.name;
            if(index === 0) 
                colorItem.classList.add('sl-p__card-slider-color-item_active');
            colorItem.style.borderColor = `${item.value}`;
            const colorItemInSideCircle = document.createElement('div');
            colorItemInSideCircle.classList.add('sl-p__card-slider-color-circle');
            colorItemInSideCircle.style = `background: ${item.value};`;

            colorItem.append(colorItemInSideCircle);
            colorList.append(colorItem);
        })
        
        wrInSliderList.append(inSliderList);
        wrInSlider.append(wrInSliderList);
        wrInSlider.append(inSliderPaginationList);
        wrInSlider.append(colorList);
        // -- слайдер внутри карточки

        const cardTitle = document.createElement('div');
        cardTitle.classList.add('sl-p__card-title');
        cardTitle.textContent = data.title;

        // все что находится под слайдером внутри карточки и исчезает
        const wrCardContent = document.createElement('div');
        wrCardContent.classList.add('sl-p__card-wr-content')
        const cardContent = document.createElement('div');
        cardContent.classList.add('sl-p__card-content');
        const sizeList = document.createElement('ul');
        sizeList.classList.add('sl-p__size-list');
        data.black.sizes.forEach((item, index, arr) => {
            const sizeItem = document.createElement('li');
            sizeItem.classList.add('sl-p__size-item');
            
            if(index === 0) sizeItem.classList.add('sl-p__size-item_active');

            const sizeItemNum = document.createElement('div');
            sizeItemNum.classList.add('sl-p__size-item-num');
            sizeItemNum.textContent = item;

            sizeItem.append(sizeItemNum);
            sizeList.append(sizeItem);
        })

        const composition = document.createElement('p');

        data.composition.forEach( item => {
            const compositionItem = document.createElement('span');
            compositionItem.textContent = item;
            composition.append(compositionItem);
        } )
        
        const wrLink = document.createElement('div');
        wrLink.classList.add('sl-p__card-wr-link');
        if(data.composition.length > 1) 
            wrLink.style.marginTop = '0.5vw'
        const link = document.createElement('a');
        link.classList.add('sl-p__card-link');
        link.textContent = 'Подробнее'
        link.href = data.link;
        link.alt = data.title;
        link.target = '_blank';
        wrLink.append(link);

        cardContent.append(sizeList);
        cardContent.append(composition);
        cardContent.append(wrLink);
        wrCardContent.append(cardContent);
        // -- все что находится под слайдером внутри карточки и исчезает

        const mask = document.createElement('div');
        mask.classList.add('sl-p__card-mask');

        
        card.append(wrInSlider);
        card.append(mask);
        card.append(cardTitle);
        card.append(wrCardContent);
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

        // сбрасываем слайдер в карточке на ноль
        this.mooveCardSlider(0);

        nextEl.addEventListener('transitionend', () => {
            this.prevCard.classList.remove('sl-p__slide-item_prev-l');
            this.prevCard.firstElementChild.style.transition = '';
            this.cardDecoR.before(this.prevCard);
     
            this.prevCard = this.activeCard;
            this.activeCard = this.nextCard;
            this.nextCard = nextEl;

            // переопределяем активный блок с размерами
            this.findActiveSize();
            // переопределяем активный внутренний слайдер
            this.findActiveCardSlider();
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

        // сбрасываем слайдер в карточке на ноль
        this.mooveCardSlider(0);

        prevEl.addEventListener('transitionend', () => {
            this.nextCard.classList.remove('sl-p__slide-item_next-r');
            this.nextCard.firstElementChild.style.transition = '';
     
            this.nextCard = this.activeCard;
            this.activeCard = this.prevCard;
            this.prevCard = prevEl;

            // переопределяем активный блок с размерами
            this.findActiveSize();
            // переопределяем активный внутренний слайдер
            this.findActiveCardSlider();
            console.log()
        }, {once: true})
    }

    mooveCardSlider(index) {
        const widthSlide = this.activeCardSlidesList.children[0].offsetWidth;
        this.activeCardSlidesList.style.transform = `
            translateX(-${(widthSlide / innerWidth * 100) * index}vw)
        `;

        const lastActivePag = this.activePaginationList.querySelector('.sl-p__card-slider-pag-item_active');
        lastActivePag.classList.remove('sl-p__card-slider-pag-item_active');
        const newActivePag = this.activePaginationList.querySelector(`[data-num="${index}"]`);
        newActivePag.classList.add('sl-p__card-slider-pag-item_active');
    }

    // выбор цвета
    changeColor(id, color, article) {
        // меняем активный кружок
        const lastActivePag = this.activeColorPag.querySelector('.sl-p__card-slider-color-item_active');
        lastActivePag.classList.remove('sl-p__card-slider-color-item_active');
        const newActivePag = this.activeColorPag.querySelector(`#${id}`);
        
        newActivePag.classList.add('sl-p__card-slider-color-item_active');

        // меняем цвет мерча
        const images = this.activeCardSlidesList.querySelectorAll('img');
        const data = this.data.find(item => item.article === article);

        // картинка исчезает
        this.activeCardSlidesList.style.opacity = '0';
        // оставляем только прозрачность чтоб незаметно после смены
        // картинки поставить его в начало
        this.activeCardSlidesList.style.transition = `
            opacity ${this.duration / 1.2}s ${this.timeF}
        `;
        
        this.activeCardSlidesList.addEventListener('transitionend', () => {
            // когда картинка исчезла сдвигаем слайдер в начало
            this.mooveCardSlider(0);
            // показываем картинку
            this.activeCardSlidesList.style.opacity = '1';
            // переставляем цвет картинок мерча
            [...images].forEach( (item, i) => {
                item.src = `${data[color].img[i]}`;
            })
            // возвращаем всю анимацию
            setTimeout(() => {
                this.activeCardSlidesList.style.transition = `
                transform ${this.duration}s ${this.timeF},
                opacity ${this.duration / 1.2}s ${this.timeF}
            `;
            })
        }, {once: true})
    }


    // выбор размера
    choosingSize(el) {
        this.activeSize.classList.remove('sl-p__size-item_active');
        this.activeSize = el;
        this.activeSize.classList.add('sl-p__size-item_active');
    }

    setTransitionCard(el) {
        el.style.transition = `
        transform ${this.duration}s ${this.timeF},
        height ${this.duration}s ${this.timeF},
        width ${this.duration}s ${this.timeF},
        box-shadow ${this.duration}s ${this.timeF}`;
    }

    findActiveSize() {
        this.activeSize = this.el
        .querySelector('.sl-p__slide-item_active .sl-p__size-item_active');
    }

    // определяем активный внутренний слайдер и его элементы
    findActiveCardSlider() {
        this.activeCardSlider = this.activeCard.querySelector('.sl-p__card-wr-slider');
        this.activeCardSlidesList = this.activeCardSlider.querySelector('.sl-p__card-slides-list');;
        this.activePaginationList = this.activeCardSlider.querySelector('.sl-p__card-slider-pag-list');
        this.activeColorPag = this.activeCardSlider.querySelector('.sl-p__card-slider-color-list');
    }
}