export default class RedrawSlHead {
    constructor(slider) {
        this.slider = slider;
        this.slides = this.slider.querySelector('.slider-h__slides-list ')
        this.arrows = [...this.slider.querySelectorAll('.slider__arrow')];
        this.paginations = this.slider.querySelector('.slider-h__pagination-list');
        this.wrLine = this.slider.querySelector('.slider-h__nav-line');
        this.videos = [...this.slider.querySelectorAll('video')];
        this.line = this.wrLine.children[0];

        this.amountSlides = this.slides.children.length;
        this.widthLine = null; // расчитано во vw

        // Параметры анимации
        this.timingFunc = 'linear';
        this.duration = '0.3'

        // Счетчик для полосы индикации
        this.lineCounter = 0;
        this.videoCounter = 0;

        // прибиваем контекст для controll
        this.initSlider = this.initSlider.bind(this);
    }

    initSlider() {
        // деактивируем слайдер если слайд один
        if(this.amountSlides === 1) return;

        this.slides.style.width = `${100 * this.amountSlides}%`

        // активируем стрелки
        this.arrows.forEach(item => item.style = 'display: block;');
        this.arrows[0].parentElement.style = 'justify-content: space-between;';

        // активируем линию прокрутки
        const widthLine = this.wrLine.offsetWidth;
        this.widthLine = (widthLine / this.amountSlides) / innerWidth * 100;
        this.line.style = `width: ${this.widthLine}vw;`;
        this.line.style.transition = `transform ${this.duration}s ${this.timingFunc}`;

        // останавливаем воспроизведение на всех слайдах кроме первого
        this.videos.forEach((v, i) => v.play && i ? v.pause() : '');
    }

    controlMovie(type) {
        // ставим предидущий слайд на паузу и в начало
        if(this.videos[this.videoCounter].play) {
            this.videos[this.videoCounter].pause();
            this.videos[this.videoCounter].currentTime = 0;
        }

        if(type === 'next') {
            // прибавляем проверяем чтоб не получить не существующий индекс
            this.videoCounter += 1;
            this.videoCounter === this.videos.length ? this.videoCounter = 0 : '';
            // запускаем видео на следующем слайде
            if(this.videos[this.videoCounter].paused) {
                this.videos[this.videoCounter].play();
            }

            return;
        }

        // прибавляем проверяем чтоб не получить не существующий индекс
        this.videoCounter -= 1;
        this.videoCounter < 0 ? this.videoCounter = this.videos.length - 1 : '';

        if(this.videos[this.videoCounter].paused) {
            this.videos[this.videoCounter].play();
        }
    }

    moveNext() {
        const width = this.slider.offsetWidth;
        this.slides.style.transition = `transform ${this.duration}s ${this.timingFunc}`;
        this.slides.style.transform = `translateX(-${width}px)`;

        this.slides.addEventListener('transitionend', () => {
            this.slides.style.transition = ``;
            this.slides.append(this.slides.children[0]);
            this.slides.style.transform = ``;
        },{once: true})

        this.moveLineNext();
        this.controlMovie('next');
    }

    movePrev() {
        const width = this.slider.offsetWidth;
        const lastSlideIndex = this.slides.children.length - 1;
        this.slides.prepend(this.slides.children[lastSlideIndex]);
        this.slides.style.transform = `translateX(-${width}px)`;

        setTimeout(() => {
            this.slides.style.transition = `transform ${this.duration}s ${this.timingFunc}`;
            this.slides.style.transform = ``;
        })

        this.slides.addEventListener('transitionend', () => {
            this.slides.style.transition = ``;
        },{once: true})

        this.moveLinePrev();
        this.controlMovie(null);
    }

    clickPag(el) {
        const num = +el.dataset.num;
        if(num === this.lineCounter) return;

        // двигаем слайды и ползунок в право
        if(num > this.lineCounter) {
            const amount = num - this.lineCounter;
            for(let i = 0; i < amount; i += 1) {
                this.moveNext();
            }
        }
        
        // двигаем слайды и ползунок в лево
        if(num < this.lineCounter) {
            const amount = this.lineCounter - num;
            for(let i = 0; i < amount; i += 1) {
                this.movePrev();
            }
        } 
    }

    moveLineNext() {
        this.lineCounter += 1;
        

        // пока слайды не зациклились
        if(this.lineCounter !== this.amountSlides) {
            const offset = this.widthLine * this.lineCounter;
            this.line.style.transform = `translateX(${offset}vw)`;
        }

        // когда слайды зациклились (повторились сначала)
        if(this.lineCounter === this.amountSlides) {
            // сдвигаем старый ползунок
            const offset = this.widthLine * this.lineCounter;
            this.line.style.transform = `translateX(${offset}vw)`;

            // Создаем новый ползунок, ставим в начало и сдвигаем
            const div = this.createLine();
            this.wrLine.prepend(div);
            div.style.transform = `translateX(-${this.widthLine}vw)`;
            setTimeout(() => {
                div.style.transform = ``;
            })

            // убираем позиционирование и переопределяем переменную с ползунком
            div.addEventListener('transitionend', () => {
                this.wrLine.children[1].remove();
                div.style.position = '';
                this.line = this.wrLine.children[0];

                this.lineCounter = 0;
            }, {once: true})
        }
    }

    moveLinePrev() {
        this.lineCounter -= 1;

        // если стартовая позиция крайнее левое положение
        if(this.lineCounter < 0) {
            const offset = this.widthLine * this.lineCounter;
            this.line.style.transform = `translateX(${offset}vw)`;

            // Создаем новый ползунок, ставим в конец и сдвигаем
            const div = this.createLine();
            this.wrLine.append(div);
            const offsetDiv = this.widthLine * this.amountSlides
            div.style.transform = `translateX(${offsetDiv}vw)`;
            this.lineCounter = this.amountSlides - 1;
            setTimeout(() => {
                const offset = offsetDiv - this.widthLine;
                div.style.transform = `translateX(${offset}vw)`;
            })

            // убираем позиционирование и переопределяем переменную с ползунком
            div.addEventListener('transitionend', () => {
                this.wrLine.children[0].remove();
                div.style.position = '';
                this.line = this.wrLine.children[0];
            }, {once: true})

            return;
        }

        // если стартовая позиция не крайнее левое положение
        if(this.lineCounter >= 0) {
            const offset = this.widthLine * this.lineCounter;
            this.line.style.transform = `translateX(${offset}vw)`;
        }
    }

    // Метод для создания ползунка
    createLine() {
        const div = document.createElement('div');
        div.style.position = 'absolute'; // чтоб вышел из потока и не сдвигал старый
        div.style.transition = `transform ${this.duration}s ${this.timingFunc}`;
        div.style.width = `${this.widthLine}vw`;
        div.classList.add('slider-h__nav-line-item');

        return div;
    }
}