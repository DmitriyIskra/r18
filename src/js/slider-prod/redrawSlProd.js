export default class RedrawSlProd {
    constructor(slider, data) {
        this.slider = slider;
        this.data = data;

        this.wrSlides = this.slider.querySelector('.sl-prod__wr-slides')
        this.slides = this.slider.querySelector('.sl-prod__slides');
        this.arrow = this.slider.querySelector('.slider__arrow');
        this.bigImg = this.slider.querySelector('.sl-prod__big-img img')

        this.amountSlides = this.slides.children.length;
        this.amountShow = 3;
        this.gap = parseFloat(getComputedStyle(this.slides).gap);
    }

    initSlider() {
        // формируем слайды
        this.data.forEach((item, index) => {
            // if ( index < this.amountShow) {
                const el = this.createSlide(
                    item.img,
                    item.title,
                    '#',
                    item.title
                    );
    
    
                if(index === 0) {
                    el.dataset.status = 'active';
                    el.classList.add('sl-prod__slide_active')
    
    
                    this.bigImg.src = item.img;
                    this.bigImg.alt = item.title;
                }
    
                this.slides.append(el);
            // }
        });

        // ставим стрелку на место
        this.arrow.style = `
        position: absolute;
        right: 2%;
        top: 50%;

        display: block;

        transform: translate(0, -50%);
        `;

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
        width += (this.gap * this.amountShow) / innerWidth * 100;
        this.wrSlides.style = `width: ${width.toFixed(3)}vw;`;
        console.log(width)
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
        divButton.append(link);

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
}