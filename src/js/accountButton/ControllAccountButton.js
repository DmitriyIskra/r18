import ApiModals from '../api-modals/ApiModals.js';

export default class ControllAccountButton extends ApiModals {
    constructor(redraw, IMask) {
        super();
        this.redraw = redraw;
        this.IMask = IMask;
    
        this.click = this.click.bind(this);
        this.clickLogReg = this.clickLogReg.bind(this);
        this.clickLogin = this.clickLogin.bind(this);
        this.clickRecover = this.clickRecover.bind(this);
        this.clickRegistration = this.clickRegistration.bind(this);

        this.mask = null;
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    
    // нажатие на КНОПКУ ACCOUNT в HEADER
    click(e) {
        // если пользователь незалогинин показываем модалку
        if(e.target.closest('.header__account a') &&
        e.target.closest('.header__account a').hash === '#0' &&
        !location.pathname.includes('account')) {
            
            // ---- pop-up ЛОГИН ИЛИ РЕГИСТРАЦИЯ
            (async () => {
                const logRegPopUp = await super.read('log-reg');
                this.redraw.openNewModal(logRegPopUp)

                this.redraw.lastActiveModal.addEventListener('click', this.clickLogReg);
            })()
        }

        
    }

    // для событий клик по окну логин или регистрация
    clickLogReg(e) {
        // закрытие log-reg
        if(e.target.closest('.modal__close')) this.redraw.closeModal();

        // ---- pop-up ВХОД В АККАУНТ
        if(e.target.closest('.modal-log-reg__button_login')) {
            this.redraw.closeModal();
            
            (async () => {
                const loginPopUp = await super.read('login');
                this.redraw.openNewModal(loginPopUp);

                this.redraw.lastActiveModal.addEventListener('click', this.clickLogin);
            })()
        }

        
        // вызов pop-up РЕГИСТРАЦИЯ
        if(e.target.closest('.modal-log-reg__button_register')) {
            (async () => {
                const registrationPopUp = await super.read('registration');
                this.redraw.openNewModal(registrationPopUp);

                this.redraw.lastActiveModal.addEventListener('click', this.clickRegistration);

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

    clickLogin(e) {
        const form = this.redraw.lastActiveModal.querySelector('form');

        // закрытие модалки вход в аккаунт
        if(e.target.closest('.modal__close')) this.redraw.closeModal(form);

        // вход в аккаунт
        if(e.target.closest('.modal-login__button')) {
            // валидация
            this.validation([form.email, form.password]);

            // сбор данных и отправка на сервер (вывод в консоль)
            if((form.email.value && !+form.email.dataset?.invalid) 
            && (form.password.value && !+form.password.dataset?.invalid)) {
                const formData = new FormData(form);
                console.log(Array.from(formData));
            }
        }
        
        // открытие модалки восстановление пароля
        if(e.target.closest('.modal-login__recover')) {
            (async () => {
                const modalRecover = await super.read('recover');

                this.redraw.openNewModal(modalRecover);

                this.redraw.lastActiveModal.addEventListener('click', this.clickRecover);
            })()
        }
    }

    // отправка данных для восстановления пароля и закрытие модалкм
    clickRecover(e) {
        // форма из модалки
        const form = this.redraw.lastActiveModal.querySelector('form');

        // закрытие модалки восстановление
        if(e.target.closest('.modal__close')) this.redraw.closeModal(form);

        // отправка данных
        if(e.target.closest('.modal-recover__button')) {
            // валидация
            this.validation([form.email]);

            if(form.email.value && !+form.email.dataset?.invalid) {
                const formData = new FormData(form);
                console.log(Array.from(formData));
            }
        };
    }

    clickRegistration(e) {
        // форма из модалки
        const form = this.redraw.lastActiveModal.querySelector('form');
        

        // закрытие модалки восстановление
        if(e.target.closest('.modal__close')) this.redraw.closeModal(form);
        
        // отправка данных на сервер
        if(e.target.closest('.modal-reg__button')) {
            // валидация
            this.validation([form.name, form.email, form.phone, form.password]);

            if(form.name.value && !+form.name.dataset?.invalid &&
                form.phone.value && !+form.phone.dataset?.invalid &&
                form.email.value && !+form.email.dataset?.invalid &&
                form.password.value && !+form.password.dataset?.invalid) {
                const formData = new FormData(form);
                console.log(Array.from(formData));
            }
        };
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