import ApiModals from '../api-modals/ApiModals.js';

export default class ControllAccountButton extends ApiModals {
    constructor(redraw) {
        super();
        this.redraw = redraw;
    
        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.redraw.el.addEventListener('click', this.click);
    }

    click(e) {
        // нажатие на кнопку account
        if(e.target.closest('.header__account a') &&
        e.target.closest('.header__account a').hash === '#0' &&
        !location.pathname.includes('account')) {
            
            (async () => {
                const logRegPopUp = await super.read('log-reg');

                logRegPopUp.addEventListener('click', e => {
                    console.log(super.read); // видит
                    // закрытие log-reg
                    if(e.target.closest('.modal__close')) logRegPopUp.remove();

                    // вызов pop-up вход
                    if(e.target.closest('.modal-log-reg__button_login')) {
                        logRegPopUp.remove();

                        (async () => {

                        })()
                    }

                    // вызов pop-up регистрация
                    if(e.target.closest('.modal-log-reg__button_register')) {
                        logRegPopUp.remove();

                        (async () => {
                            
                        })()
                    }
                })
                document.body.append(logRegPopUp);
            })()
        }
    }
}