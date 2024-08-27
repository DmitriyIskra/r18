import ApiModals from '../api-modals/ApiModals.js';

export default class ControllBasketButton extends ApiModals {
    constructor(redraw, IMask) {
        super();
        this.redraw = redraw;
        this.IMask = IMask;
    
        this.click = this.click.bind(this);
        this.clickBasket = this.clickBasket.bind(this);

        this.mask;
    }

    init() {
        this.registerEvents();
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
        // if(e.target.closest('.header__account a') &&
        // e.target.closest('.header__account a').hash === '#0' &&
        // !location.pathname.includes('account')) {
            
        //     // ---- pop-up ЛОГИН ИЛИ РЕГИСТРАЦИЯ
        //     (async () => {
        //         const logRegPopUp = await super.read('log-reg');
        //         this.redraw.openNewModal(logRegPopUp)

        //         this.redraw.lastActiveModal.addEventListener('click', this.clickLogReg);
        //     })()
        // }
    }

    clickBasket(e) {
        // закрытие корзины
        if(e.target.closest('.modal__close')) this.redraw.closeModal();

        if(e.target.closest('.modal-basket__goods-amount-button')) {
            const button = e.target.closest('.modal-basket__goods-amount-button');
            
            this.redraw.calcAmountGoods(button);            
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
}