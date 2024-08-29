import ApiModals from '../api-modals/ApiModals.js';

export default class ControllBasketButton extends ApiModals {
    constructor(redraw, IMask) {
        super();
        this.redraw = redraw;
        this.IMask = IMask;
    
        this.click = this.click.bind(this);
        this.clickBasket = this.clickBasket.bind(this);
        this.addToBasket = this.addToBasket.bind(this);

        this.mask;
    }

    init() {
        this.registerEvents(); 

        // здесь проверяем локал сторадже и если там что то есть отрисовываем корзину иконку
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    
    // нажатие на КНОПКУ ACCOUNT в HEADER
    click(e) {
        if(e.target.closest('.header__basket')) {
            // ---- pop-up basket
            (async () => {
                const logRegPopUp = await super.read('basket');
                this.redraw.openNewModal(logRegPopUp)

                this.redraw.lastActiveModal.addEventListener('click', this.clickBasket);

                // на телефон формы регистрации вешаем при фокусе маску
                const form = this.redraw.lastActiveModal.querySelector('form');

                form.phone.addEventListener('focus', (e) => {
                    this.mask = new this.IMask(e.target, {
                        mask: '+{7} (000) 000-00-00',
                        lazy: false,
                        placeholderChar: '_',
                    })

                    form.phone.addEventListener('blur', (e) => {
                        const phone = e.target.value;
                        const result = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(phone);
                        if(!result) {
                            this.mask.destroy();
                            e.target.value = '';
                        };
                    })
                })
            })()
        }
    }

    clickBasket(e) {
        // закрытие корзины
        if(e.target.closest('.modal__close')) this.redraw.closeModal();

        if(e.target.closest('.modal-basket__goods-amount-button')) {
            const button = e.target.closest('.modal-basket__goods-amount-button');
            
            this.redraw.calcAmountGoods(button);            
        }

        // отправляем заказ на сервер и показываем соответствующую модалку
        if(e.target.closest('.modal-basket__button')) {

            // Открытие модалки заказ успешно или не успешно отправлен
            // результат отправки
            const resultSend = false;
            (async () => {
                // тип модалки
                let typeModal = 'order-successfully';
                if(!resultSend) typeModal = 'failed';

                const orderSuccessfully = await super.read(typeModal);
                this.redraw.openNewModal(orderSuccessfully);

                this.redraw.lastActiveModal.addEventListener('click', (e) => {
                    // закрытие корзины
                    if(e.target.closest('.modal__close')) this.redraw.closeModal();
                });
            })()
        }
    }

    // валидация заполненности полей
    validation(inputs) { 
        inputs.forEach(item => {
            // поле не заполненно
            if(!item.value) { // валидация
                this.redraw.incorrectData(item, 'Заполните пожалуйста поле');
            }
        })
    }

    addToBasket(data, amount = 1) {
        // article: "3"
        // color: ""
        // imgUrl: ['./img/content/accessories-nok-box-motta-105-content.webp']
        // price: "4 000 p."
        // sectionName: "accessories"
        // size: "105 мм"
        // title: "Нок-бокс"

        // если корзина пуста
        if(!localStorage.basket) {
            localStorage.basket = JSON.stringify([data]);
            console.log('корзина пуста')
            return;
        }

        // если в корзине уже что то есть
        const basket = JSON.parse(localStorage.basket);
        delete localStorage.basket;
        
        const product = basket.find(item => {
            return item.article === data.article && item.title === data.title
        })

        // если товар не найден
        if(!product) {
            basket.push(data);
            localStorage.basket = JSON.stringify(basket);
            console.log('такой не найден', JSON.parse(localStorage.basket))
            return;
        }

        // если найден, уже добавлялся, увеличиваем количество на 1
        basket.forEach(item => {
            if(item.article === data.article && item.title === data.title) {
                item.amount = +item.amount + amount;
            }
        })

        
        localStorage.basket = JSON.stringify(basket);
    }
}