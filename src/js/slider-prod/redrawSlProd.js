export default class RedrawSlProd {
    constructor(slider, data) {
        this.slider = slider;
        this.data = data;

        this.slides = this.slider.querySelector('.sl-prod__slides');
        this.arrow = this.slider.querySelector('.slider__arrow');

        this.amountSlides = this.slides.children.length;
    }

    initSlider() {

        this.data.forEach(item => {
            const el = this.createSlide(
                item.img,
                item.title,
                '#',
                item.title
                );
            this.slides.append(el);
        });

        this.arrow.style = `
        position: absolute;
        right: 0;
        top: 50%;

        display: block;

        transform: translate(100%, -50%);
        `
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