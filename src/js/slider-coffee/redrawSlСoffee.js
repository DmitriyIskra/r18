export default class RedrawSlСoffee {
    constructor(slider, data) {
        this.slider = slider;
        this.data = data;

        this.description = this.slider.querySelector('.sl-prod__text-about');
        this.wrSlides = this.slider.querySelector('.sl-prod__wr-slides');
        this.slides = this.slider.querySelector('.sl-prod__slides');
        this.arrow = this.slider.querySelector('.slider__arrow');
        this.wrBigImg = this.slider.querySelector('.sl-prod__wr-big-img');
        this.bigImg = this.wrBigImg.querySelector('img');

        this.amountSlides = this.slides.children.length;
        this.amountShow = 3;

        this.timeFunc = 'ease-out';
        this.duration = 0.7;
        this.durationHalf = this.duration / 2;

        this.oldActiveSlide = null;
        this.activeSlide = null;

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
    
                if(index === 0) {
                    el.classList.add('sl-prod__slide_active');
    
                    this.bigImg.src = item.img;
                    this.bigImg.alt = item.title;
                }
                el.id = item.id;
    
                this.slides.append(el);

        });

        // Запоминаем активный слайд
        this.activeSlide = this.slides.children[0];

        // ставим стрелку на место
        this.arrow.style = `
        position: absolute;
        right: 2%;
        top: 50%;

        display: block;

        transform: translate(0, -50%);
        `;

        // задаем ширину контейнеру со слайдами во vw
        this.setWidthSliderContainer();

        // Заполняем информацию о продукте
        this.fillTextInfo();

        // Определяем анимацию для большой картинки
        this.bigImg.style.transition = `opacity ${this.duration}s ${this.timeFunc}`;

        // Определяем анимацию для блока с текстом, описанием товара
        this.description.style.transition = `opacity ${this.durationHalf}s ${this.timeFunc}`;
    }

    move() {
        // блокируем накликивание
        if(this.block) return;
        this.block = true;

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

            this.block = false;
        }, {once: true});

        // меняем большую картинку и описание товара
        this.changeBigImg();
        this.changeTextInfo();
    }

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
                    transition: opacity ${this.duration}s ${this.timeFunc};
                `;

                el.style = `transition: opacity ${this.duration}s ${this.timeFunc};`;

                el.after(newEl);

                setTimeout(() => {
                    el.style.opacity = '0';
                    newEl.style.opacity = '1';
                }, 20)

                el.addEventListener('transitionend', () => {
                    el.remove();
                    newEl.style = 'opacity: 1;'
                }, {once: true})
            }
        })
        // this.description.classList.remove('sl-prod__text-about_visible');

        // this.description.addEventListener('transitionend', () => {
            // this.fillTextInfo();

        //     this.description.classList.add('sl-prod__text-about_visible');
        // }, {once: true})
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
        img.src = pathImg;
        divImg.append(img);

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
        // задаем ширину контейнеру со слайдами во vw
        let width = [...this.slides.children].reduce( (acc, item, index) => {
            return index < this.amountShow ? 
            (
                acc += item.offsetWidth / innerWidth * 100
            ) : 
            (
                acc
            );
        }, 0);
        width += ((this.getGap() * this.amountShow) / innerWidth * 100);
        this.wrSlides.style = `width: ${width.toFixed(3)}vw;`;
    }

    getGap() {
        return parseFloat(getComputedStyle(this.slides).gap);
    }
}