export default class RedrawSlProd {
    constructor(slider, data) {
        this.slider = slider;
        this.data = data;

        this.description = this.slider.querySelector('.sl-prod__text-about')

        this.wrSlides = this.slider.querySelector('.sl-prod__wr-slides')
        this.slides = this.slider.querySelector('.sl-prod__slides');
        this.arrow = this.slider.querySelector('.slider__arrow');
        this.bigImg = this.slider.querySelector('.sl-prod__big-img img');

        this.amountSlides = this.slides.children.length;
        this.amountShow = 3;

        this.timeFunc = 'linear';
        this.duration = '0.3s';

        this.oldActiveSlide = null;
        this.activeSlide = null;
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
    
    
                if(index === 0) {
                    // el.dataset.status = 'active';
                    el.classList.add('sl-prod__slide_active');
                    el.id = item.id
    
    
                    this.bigImg.src = item.img;
                    this.bigImg.alt = item.title;
                }
    
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
        this.fillContent();
    }

    move() {
        // подставляем первый слайд назад
        const clone = this.activeSlide.cloneNode(true);
        clone.classList.remove('sl-prod__slide_active');
        this.slides.append(clone);
        this.setWidthSliderContainer();

        this.slides.style.transition = `transform ${this.duration} ${this.timeFunc}`;
        setTimeout(() => {
            // получаем ширину активного слайда vw
            const width = this.activeSlide.offsetWidth;
            const offset = (width + this.getGap()) / innerWidth * 100;
            this.slides.style.transform = `translateX(-${offset}vw)`;
            this.oldActiveSlide = this.activeSlide;
            this.activeSlide = this.slides.children[1];
            this.activeSlide.classList.add('sl-prod__slide_active');
        })

        this.slides.addEventListener('transitionend', () => {
            this.slides.style.transition = ``;
            this.oldActiveSlide.remove();
            this.slides.style.transform = ``;
        }, {once: true});
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
        link.textContent = 'Подробнее';
        const linkDeco = this.createEl('div', 'sl-prod__wr-button-slide-deco');
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

    fillContent() {
        const id = this.activeSlide.id;
        const info = this.data.find( item => item.id === id);
        const keys = Object.keys(info);
        keys.forEach( item => {
            const el = this.description.querySelector(`[data-type="${item}"]`);
            if(el) el.textContent = info[item]
        })
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
        width += (this.getGap() * this.amountShow) / innerWidth * 100;
        this.wrSlides.style = `width: ${width.toFixed(3)}vw;`;
    }

    getGap() {
        return parseFloat(getComputedStyle(this.slides).gap);
    }
}