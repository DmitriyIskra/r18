import ApiModals from "../api-modals/ApiModals.js";

export default class ControllAccount extends ApiModals {
    constructor(redraw, AirDatepicker, IMask) {
        super();
        this.redraw = redraw;
        this.AirDatepicker = AirDatepicker;
        this.IMask = IMask; // активируем при фокусе

        this.clickNav = this.clickNav.bind(this);
        this.click = this.click.bind(this);
        this.focus = this.focus.bind(this);
    }

    init() {
        this.registerEvents();

        this.redraw.history.initScroll();

        this.initCalendar();
    }

    registerEvents() {
        this.redraw.content.el.addEventListener('click', this.clickNav);
        this.redraw.profile.el.addEventListener('click', this.click);
        this.redraw.history.el.addEventListener('click', this.click);

        this.redraw.profile.form.phone.addEventListener('focus', this.focus);
    }

    initCalendar() {
        const inputDate = this.redraw.profile.form.born_date;
        new this.AirDatepicker(inputDate, {
            isMobile : innerWidth <= 1200 ? true : false,
            autoClose : true,
        });
    }

    click(e) {
        // открытие возможности редактирования данных аккаунта
        if(e.target.closest('.profile__button_edit')) {
            this.redraw.profile.openEditProfile();
        }

        // закрытие возможности редактирования данных аккаунта
        if(e.target.closest('.profile__button_save')) {

            const formData = new FormData(this.redraw.profile.form);
            console.log(Array.from(formData));

            // блокировка inputs (disabled)
            this.redraw.profile.closeEditProfile();

            // открытие модалки профиль успешно отредактирован
            // (async () => {
            //     const result = await super.read('edit-profile-successfully');
            //     const cancel = result.querySelector('.modal__close');
            //     cancel.addEventListener('click', () => {
            //         result.remove();
            //     }, {once : true})

            //     this.redraw.content.el.append(result);
            // })()
        }

        if(e.target.closest('.profile__button_delete')) {
            // получаем html модалки на подтверждение удаления аккаунта
            (async () => {
                const result = await super.read('is-delete-account');
                const cancel = result.querySelector('.modal-del-acc__button_cancel');
                cancel.addEventListener('click', () => {
                    result.remove();
                }, {once : true})

                this.redraw.content.el.append(result);
            })() 
        }



        if(e.target.closest('.history__details-title') || e.target.matches('.history__details-title')) {
            const el = e.target.parentElement;

            this.redraw.history.showHideDetails(el);
        }
    }

    
    clickNav(e) {
        // смена контента по меню
        if(e.target.closest('.account__tabs-item')) {
            const type = e.target.dataset.type_acc;
            
            this.redraw.content.changeContent(type);
        }
    }

    // активируем маску ввода телефона
    focus(e) {
        new this.IMask(e.target, {
            mask: '+{7} (000) 000-00-00',
            lazy: false,
            placeholderChar: '_',
        })
    }
}