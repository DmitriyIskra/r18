export default class RedrawSlСoffee {
    constructor(slider, data) {
        this.slider = slider;
        this.data = data;

        this.description = this.slider.querySelector('.sl-prod__text-about');
        this.wrSlides = this.slider.querySelector('.sl-prod__wr-slides');
        this.slides = this.slider.querySelector('.sl-prod__slides');
        this.wrBigImg = this.slider.querySelector('.sl-prod__wr-big-img');
        this.bigImg = this.wrBigImg.querySelector('img');

        this.amountSlides = null;

        // количество видимых слайдов десктоп
        this.amountShowDesc = 3;

        this.timeFunc = 'ease-out';
        this.duration = 0.7;
        this.durationChangeTextInfo = this.duration;
        this.durationHalf = this.duration / 2;

        this.oldActiveSlide = null;
        this.activeSlide = null;

        this.swipeStart = null;
        this.touchMoved = null;
        this.relocated = false; // для смещения в prev, чтоб перетавить слайд один раз
        this.currentOffset = null; // текущее смещение всего слайдера
        this.startTimeStamp = null;
        this.endTimeStamp = null;
        
        this.sizeOffset = null; // px

        this.block = false;
    }

    initSlider() { 
        // формируем слайды
        this.data.forEach((item, index) => {
            const el = this.createSlide(
                item.img,
                item.title,
                '#',
                item.title
                );

            el.style.transition = `height ${this.duration}s ${this.timeFunc}, width ${this.duration}s ${this.timeFunc}`;

            if(index === 0 && innerWidth > 961) {
                el.classList.add('sl-prod__slide_active');

                this.bigImg.src = item.img;
                this.bigImg.alt = item.title;
            }
            el.id = item.id;

            this.slides.append(el);
        });

        // Запоминаем активный слайд
        this.activeSlide = this.slides.children[0];

        this.amountSlides = this.slides.children.length;

        // задаем ширину контейнеру со слайдами во vw для десктоп
        // в % для мобилки
        this.setWidthSliderContainer();

        // Заполняем информацию о продукте
        this.fillTextInfo();

        // Определяем анимацию для большой картинки
        this.bigImg.style.transition = `opacity ${this.duration}s ${this.timeFunc}`;

        // Определяем анимацию для блока с текстом, описанием товара
        this.description.style.transition = `opacity ${this.durationHalf}s ${this.timeFunc}`;
    }

    moveNext() {
        // блокируем накликивание
        if(this.block) return;
        this.block = true;

        // для десктопа
        if(innerWidth > 961) {
            // клонируем и подставляем первый слайд назад
            const clone = this.activeSlide.cloneNode(true);
            clone.classList.remove('sl-prod__slide_active');
            this.slides.append(clone);
            this.setWidthSliderContainer();

            // устанавливаем анимацию
            this.slides.style.transition = `transform ${this.duration}s ${this.timeFunc}`;

            this.oldActiveSlide = this.activeSlide;
            this.activeSlide = this.slides.children[1];
            this.activeSlide.classList.add('sl-prod__slide_active');


            setTimeout(() => {
                // получаем ширину активного слайда vw и двигаем
                const width = this.oldActiveSlide.offsetWidth;
                const offset = (width + this.getGap()) / innerWidth * 100;
                this.slides.style.transform = `translateX(-${offset}vw)`;
            })

            this.slides.addEventListener('transitionend', () => {
                this.slides.style.transition = ``;
                this.oldActiveSlide.remove();
                this.slides.style.transform = ``;
            }, {once: true});

            // меняем большую картинку и описание товара
            this.changeBigImg();
            this.changeTextInfo();
        }

        // Для мобилки
        if(innerWidth <= 961) {
            const offset = this.slides.children[0].offsetWidth / innerWidth * 100;

            // устанавливаем анимацию
            this.slides.style.transition = `transform ${this.duration}s ${this.timeFunc}`;

            // Меняем активный слайд
            this.activeSlide = this.slides.children[1];

            setTimeout(() => {
                // Сдвигаем
                this.slides.style.transform = `translateX(-${offset}vw)`;
            })

            this.slides.addEventListener('transitionend', () => {
                this.slides.style.transition = ``;
                this.slides.append(this.slides.children[0]);
                this.slides.style.transform = ``;
            }, {once: true});

            // Меняем описание
            this.changeTextInfo();
        }
        
    }

    movePrev() {
        // блокируем накликивание
        if(this.block) return;
        this.block = true;

        // ставим последний слайд в начало
        const lastElement = this.slides.children[this.slides.children.length - 1];
        this.slides.prepend(lastElement);
        const offset = this.slides.children[0].offsetWidth / innerWidth * 100;
        console.log(offset)
        this.slides.style.transform = `translateX(-${offset}vw)`;

        // Меняем активный слайд
        this.activeSlide = this.slides.children[0];

        setTimeout(() => {
            // сдвигаем
            this.slides.style.transition = `transform ${this.duration}s ${this.timeFunc}`;
            this.slides.style.transform = ``;
        }, 20)
        
        this.slides.addEventListener('transitionend', () => {
            this.slides.style.transition = ``;
        }, {once: true});

        // Меняем описание
        this.changeTextInfo();
    }

    // SWIPE START
    touchStart(data) {
        this.swipeStart = data;
        // Размер слайда или максимальная ширина сдвига 
        this.getWidthOffset();
        // Актуальный сдвиг
        this.currentOffset = this.slides.getBoundingClientRect().x;

        this.startTimeStamp = new Date().getTime();
    }

    swipe(p) {
        if(this.block) return;

        this.touchMoved = (this.swipeStart - p);

        if(!this.relocated && this.touchMoved < 0) {
            this.slides.prepend(this.slides.children[this.slides.children.length - 1]);
            this.slides.style.transform = `translateX(-${this.sizeOffset}px)`;
            this.currentOffset = this.slides.getBoundingClientRect().x;
            this.relocated = true;
        }

        this.slides.style.transform = `translateX(${this.currentOffset - this.touchMoved}px)`;
    }

    touchEnd(data) {
        // блокируем накликивание
        if(this.block) return;
        this.block = true;

        // сколько времени прошло между start и end
        const timeDifference = new Date().getTime() - this.startTimeStamp;

        // осталось до полной прокрутки
        const r = this.sizeOffset - this.touchMoved;

        // Вычисляем за какое время во время касания сдвигался один пиксель 
        // и умножаем это значение на количество оставшихся для сдвига пикселей
        const durationOnePx = (timeDifference) / Math.abs(this.touchMoved);    
        let durationRemained = (durationOnePx * r) / 1000;
        durationRemained = durationRemained > 0.3 ? 0.3 : durationRemained;

        // Установка анимаций
        this.slides.style.transition = `
            transform ${(durationRemained)}s ${this.timeFunc}
        `;
        // Корректируем время анимации смены текста описания под время свайпа слайда
        this.durationChangeTextInfo = durationRemained;


        //  ====== ----  если слайд был смещен не на много
        if(Math.abs(this.touchMoved) <= this.sizeOffset / 3.5) {

            // смещение устанавливаем в зависимости подставлен слайд в начало или нет
            const offset = this.relocated ? this.sizeOffset * -1 : 0;
                this.slides.style.transform = `
                    translateX(${offset}px)
                `;
            
            this.slides.addEventListener('transitionend', () => {
                this.slides.style.transition = '';

                // если уже был подставлен элемент в начало
                if(this.relocated) {
                    this.slides.append(this.slides.children[0]);
                    this.slides.style.transform = ``;
                    this.relocated = false;
                }

                this.block = false
            }, {once: true})

            return;
        }

        //  ====== ----   to next
        if(this.swipeStart > data) {  
            // Обновляем насколько сдвинут блок со слайдами
            this.currentOffset = this.slides.getBoundingClientRect().x;
            
            setTimeout(() => {
                this.slides.style.transform = `translateX(-${Math.abs(this.currentOffset) + r}px)`;
            },10)

            // принцип работы слайдера такой что при next следующий активный 
            // слайд, пока не произошла перестановка всегда под индексом 1
            this.activeSlide = this.slides.children[1];

            this.slides.addEventListener('transitionend', () => {
                this.slides.style.transition = ``;
                this.slides.append(this.slides.children[0]);
                // если в процессе свайпа, сначала был свайп в prev и был добавлен элемент в начало
                if(this.relocated) {
                    this.slides.append(this.slides.children[0]);
                    this.relocated = false;
                }

                this.slides.style.transform = ``;
            }, {once: true})
        }

        //  ====== ----   to prev
        if(this.swipeStart < data) {          
            setTimeout(() => {
                this.slides.style.transform = ``;
            },10)

            this.activeSlide = this.slides.children[0];

            this.slides.addEventListener('transitionend', () => {
                this.slides.style.transition = ``;
                // если в процессе свайпа, сначала был свайп в prev и был добавлен элемент в начало
                if(this.relocated) {
                    this.relocated = false;
                }
            }, {once: true})
        }

        // Меняем описание
        this.changeTextInfo();
    }

    // SWIPE END

    changeBigImg() {
        // создаем новый элемент и создаем для него все необходимые параметры
        const img = this.createEl('img', 'sl-prod__big-img');
        img.style = `
            position: absolute;
            left: 0;
            transition: opacity ${this.duration}s ${this.timeFunc};
        `;

        // получаем следующий эелемент который станет активным
        const activeImg = this.oldActiveSlide.nextSibling.children[0].children[0];
        img.src = activeImg.src; // указываем src для нового элемента
        this.wrBigImg.append(img);

        setTimeout(() => {  
            this.wrBigImg.lastElementChild.classList.add('sl-prod__big-img_visible');
            this.bigImg.classList.remove('sl-prod__big-img_visible');
        });
        
        this.bigImg.addEventListener('transitionend', () => {
            this.bigImg.remove();
            this.bigImg = this.wrBigImg.lastElementChild;
            this.bigImg.style.position = 'relative';
        }, {once: true})
    }

    changeTextInfo() {
        const id = this.activeSlide.id;
        const info = this.data.find( item => item.id === id);
        const keys = Object.keys(info);
        keys.forEach( item => {
            const el = this.description.querySelector(`[data-type="${item}"]`);
            if(el) {
                const newEl = this.createEl(el.localName, el.className);
                newEl.dataset.type = el.dataset.type;
                newEl.textContent = info[item];
                newEl.style = `
                    position: absolute;
                    top: 0;
                    ${el.dataset.type === 'title' ||
                    el.dataset.type === 'taste' ||
                    el.dataset.type === 'aroma' ? (
                        'left: 0;'
                    ) : (
                        'right: 0;'
                    )}
                    opacity: 0;
                    transition:
                     opacity
                     ${this.durationChangeTextInfo}s
                     ${this.timeFunc}
                    ;
                `;

                el.style = `transition: opacity ${this.duration}s ${this.timeFunc};`;

                el.after(newEl);

                setTimeout(() => {
                    el.style.opacity = '0';
                    newEl.style.opacity = '1';
                }, 20)

                el.addEventListener('transitionend', () => {
                    el.remove();
                    newEl.style = 'opacity: 1;';

                    // Возвращаем сдантартное время смены текста (для клика)
                    this.durationChangeTextInfo = this.duration;

                    this.block = false;
                }, {once: true})
            }
        })
    }

    fillTextInfo() {
        const id = this.activeSlide.id;
        const info = this.data.find( item => item.id === id);
        const keys = Object.keys(info);
        keys.forEach( item => {
            const el = this.description.querySelector(`[data-type="${item}"]`);
            if(el) el.textContent = info[item]
        })
    }

    createSlide(pathImg, title, href, linkTitle) {
        const li = this.createEl('li', 'sl-prod__slide');

        const divImg = this.createEl('div', 'sl-prod__wr-img-slide');
        const img = this.createEl('img', 'sl-prod__img-slide');
        const imgDecoShadow = this.createEl('div', 'sl-prod__img-slide-deco');
        img.src = pathImg;
        divImg.append(img);
        divImg.append(imgDecoShadow);

        const divTitle = this.createEl('div', 'sl-prod__wr-title-slide');
        const h3 = this.createEl('h3', 'sl-prod__title-slide');
        h3.textContent = title;
        divTitle.append(h3);

        const divButton = this.createEl('div', 'sl-prod__wr-button-slide');
        const link = this.createEl('a', 'sl-prod__button-slide');
        link.href = href;
        link.title = linkTitle;
        link.textContent = 'Заказать';
        const linkDeco = this.createEl('div', 'sl-prod__wr-button-slide-deco');
        linkDeco.style.transition = `opacity ${this.duration}s ${this.timeFunc}`;
        divButton.append(link);
        divButton.append(linkDeco);

        li.append(divImg);
        li.append(divTitle);
        li.append(divButton);

        return li;
    }

    createEl(el, className) {
        const element = document.createElement(el);
        element.classList.add(className);
        return element;
    }

    setWidthSliderContainer() {
        // для десктопа
        if(innerWidth > 961) {
            // задаем ширину контейнеру со слайдами во vw
            let width = [...this.slides.children].reduce( (acc, item, index) => {
                return index < this.amountShowDesc ? 
                (
                    acc += item.offsetWidth / innerWidth * 100
                ) : 
                (
                    acc
                );
            }, 0);
            width += ((this.getGap() * this.amountShowDesc) / innerWidth * 100);
            this.wrSlides.style = `width: ${width.toFixed(3)}vw;`;
        }
        
        // для мобилки
        if(innerWidth <= 961 ) {
            const widtsSlidesList = this.amountSlides * 100;
            this.slides.style.width = `${widtsSlidesList}%`;
        }
    }

    getWidthOffset() {
        this.sizeOffset = this.slides.children[0].offsetWidth;
    }

    getGap() {
        return parseFloat(getComputedStyle(this.slides).gap);
    }
}