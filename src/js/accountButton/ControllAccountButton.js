import ApiModals from '../api-modals/ApiModals.js';

export default class ControllAccountButton extends ApiModals {
    constructor(redraw) {
        super();
        this.redraw = redraw;
    
        this.click = this.click.bind(this);
        this.clickLogReg = this.clickLogReg.bind(this);
        this.clickLogin = this.clickLogin.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    
    // нажатие на КНОПКУ ACCOUNT
    click(e) {
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
            logRegPopUp.remove();

            (async () => {
                
            })()
        }
    }

    clickLogin(e) {
        const form = this.redraw.lastActiveModal.querySelector('form');

        // закрытие модалки вход в аккаунт
        if(e.target.closest('.modal__close')) this.redraw.closeModal(form);

        if(e.target.closest('.modal-login__button')) {
            if(!form.email.value) { // валидация
                this.redraw.incorrectData(form.email, 'Некорректный логин');

                form.email.addEventListener('focus', () => {
                    form.email.style.color = '#fff';
                    form.email.value = '';
                    form.email.dataset.invalid = '';
                }, { once : true })
            }

            if(!form.password.value) { // валидация
                this.redraw.incorrectData(form.password, 'Некорректный пароль');

                form.password.addEventListener('focus', () => {
                    form.password.type = 'password';
                    form.password.style.color = '#fff';
                    form.password.value = '';
                    form.password.dataset.invalid = '';
                }, { once : true })
            }

            if((form.email.value && !+form.email.dataset?.invalid) 
            && (form.password.value && !+form.password.dataset?.invalid)) {
                const formData = new FormData(form);
                console.log(Array.from(formData));
            }

            if(e.target.closest('.modal-login__recover')) {
                this.redraw.closeModal();

                (async () => {
                    const modalRecover = super.read('recover');

                    this.redraw.openNewModal(modalRecover);
                })()
            }
        }
    }
}