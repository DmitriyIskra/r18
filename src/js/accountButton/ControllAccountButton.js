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
        this.clickConfirmCode = this.clickConfirmCode.bind(this);

        this.mask = null;
        this.currentPlaceholder = null;
    }

    init() { 
        this.registerEvents();

        const path = location.pathname;
        if(path.includes('account')) {
            this.redraw.el.classList.add('header__account_active');
        }
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
                // удаление и установка input placeholder
                this.registerEventsInputsText(this.redraw.lastActiveModal);
            })()
        }

        
        // вызов pop-up РЕГИСТРАЦИЯ
        if(e.target.closest('.modal-log-reg__button_register')) {
            (async () => {
                const registrationPopUp = await super.read('registration');
                this.redraw.openNewModal(registrationPopUp);

                this.redraw.lastActiveModal.addEventListener('click', this.clickRegistration);
                // удаление и установка input placeholder
                this.registerEventsInputsText(this.redraw.lastActiveModal);

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
                // удаление и установка input placeholder
                this.registerEventsInputsText(this.redraw.lastActiveModal);
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
    // для событий по форме регистрации
    clickRegistration(e) {
        // форма из модалки
        const form = this.redraw.lastActiveModal.querySelector('form');
        
        // закрытие модалки регистрация
        if(e.target.closest('.modal__close')) this.redraw.closeModal(form);
        
        // отправка данных на сервер
        if(e.target.closest('.modal-reg__button')) {
            const inputs = form.querySelectorAll('.modal__wr-input > input');

            const resultsValidation = [];
            // валидация заполненности текстовых полей
            resultsValidation.push(this.validation([...inputs]));
            // валидация email
            resultsValidation.push(this.validationPatternEmail(form.email));
            // валидация телефона
            resultsValidation.push(this.validationPatternPhone(form.phone));
            // валидация чекбокса
            resultsValidation.push(this.validationCheckbox([form.confirm]));

            const totalResult = resultsValidation.some(item => item.length > 0);
            
            // если хоть одно поле будет не валидно в 
            // totalResult будет true
            if(totalResult) return;

            // ОТКРЫВАЕМ ФОРМУ ДЛЯ ВВОДА КОДА ПОДТВЕРЖДЕНИЯ
            (async () => {
                const confirmCodePopUp = await super.read('code');

                this.redraw.openNewModal(confirmCodePopUp);

                this.redraw.lastActiveModal.addEventListener('click', this.clickConfirmCode);
                // удаление и установка input placeholder
                this.registerEventsInputsText(this.redraw.lastActiveModal);
            })();

            // if(form.name.value && !+form.name.dataset?.invalid &&
            //     form.phone.value && !+form.phone.dataset?.invalid &&
            //     form.email.value && !+form.email.dataset?.invalid &&
            //     form.password.value && !+form.password.dataset?.invalid) {
            //     const formData = new FormData(form);
            //     console.log(Array.from(formData));
            // }
        };
    }

    clickConfirmCode(e) {
        // форма из модалки
        const form = this.redraw.lastActiveModal.querySelector('form');
                
        // закрытие модалки регистрация
        if(e.target.closest('.modal__close')) this.redraw.closeModal(form);

        // отправка данных на сервер
        if(e.target.closest('.modal-code__button')) {
            const inputs = form.querySelectorAll('.modal__wr-input > input');

            // валидация заполненности текстовых полей
            const result = this.validation([...inputs]);
            
            // если длинна массива result больше 0
            // значит есть не валидные значения
            if(result.length) return;

            // if(form.code.value && !+form.name.dataset?.invalid) {
            //     const formData = new FormData(form);
            //     console.log(Array.from(formData));
            // }
        };
    }

    // при фокусе поле очищается если нет value
    // при blur заполняется, если нет value
    registerEventsInputsText(modal) {
        const inputs = modal.querySelectorAll('form input[type="text"], form input[type="email"], form input[type="password"]');

        [...inputs].forEach(input => {
            input.addEventListener('focus', e => {
                this.currentPlaceholder = e.target.placeholder;
                e.target.removeAttribute('placeholder');
                this.redraw.hideRequiredStar(input);
            })
            input.addEventListener('blur', e => { 
                e.target.setAttribute('placeholder', this.currentPlaceholder);
                this.currentPlaceholder = null;
                this.redraw.showRequiredStar(input);
            })
        });
    }

    // валидация заполненности полей
    validation(inputs) {
        const result = [];
        inputs.forEach(item => {
            // поле не заполненно
            if(!item.value) { // валидация
                this.redraw.incorrectData(item, 'Поле обязательное для заполнения');
                result.push(false);
            }
        })

        return result;
    }

    validationCheckbox(checkbox) {
        const result = [];
        checkbox.forEach(ch => {
            if(!ch.checked) {
                this.redraw.invalidCheckbox(ch)
                result.push(false);
            };
        });

        return result;
    }

    validationPatternPhone(phone) {
        const totalResult = [];
        const result = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/ig.test(phone.value);
        if(!result) {
            this.redraw.incorrectData(phone, 'Некорректно введен номер');
            totalResult.push(false);
        }

        return totalResult;
    }

    validationPatternEmail(email) {
        const totalResult = [];
        const result = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+\.[A-Z]{2,4}$/i.test(email.value);
        if(!result) {
            this.redraw.incorrectData(email, 'Некорректно введена почта');
            totalResult.push(false);
        }

        return totalResult;
    }
}