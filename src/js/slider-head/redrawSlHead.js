export default class RedrawSlHead {
    constructor(slider, data) {
        this.slider = slider;
        this.arrows = [...this.slider.querySelectorAll('.slider__arrow')];
        this.data = data;

        this.amountSlides = this.data.length;
    }

    initSlider() {
        // определяем высоту слайдера во все окно
        const heightWindow = innerHeight;
        this.slider.style = `height: ${heightWindow}px;`;

        // деактивируем слайдер если слайд один
        if(this.amountSlides === 1) return;

        this.arrows.forEach(item => item.style = 'display: block;');
        this.arrows[0].parentElement.style = 'justify-content: space-between;'
    }
}