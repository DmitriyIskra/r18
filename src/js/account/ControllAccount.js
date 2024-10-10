import ApiModals from "../api-modals/ApiModals.js";

export default class ControllAccount extends ApiModals {
    constructor(redraw, AirDatepicker, IMask) {
        super();
        this.redraw = redraw;
        this.AirDatepicker = AirDatepicker;
        this.IMask = IMask; // активируем при фокусе

        this.instanceIMask = null;

        this.clickNav = this.clickNav.bind(this);
        this.click = this.click.bind(this);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
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

        [...this.redraw.profile.inputsUserDataText]
            .forEach(item => item.addEventListener('focus', this.focus));
        [...this.redraw.profile.inputsUserDataText]
            .forEach(item => item.addEventListener('blur', this.blur));

        [...this.redraw.profile.inputsForms['address']]
            .forEach(item => item.addEventListener('focus', this.focus));
        [...this.redraw.profile.inputsForms['address']]
            .forEach(item => item.addEventListener('blur', this.blur));
    }

    initCalendar() {
        const inputDate = this.redraw.profile.formUserData.born_date;
        new this.AirDatepicker(inputDate, {
            isMobile : innerWidth <= 1200 ? true : false,
            autoClose : true,
        });
    }

    click(e) {
        // PROFILE
        // ---- user data
        // открытие возможности редактирования данных аккаунта
        if(e.target.closest('.profile__button_edit')) {
            this.redraw.profile.openEditForm('user-data');
        }

        // закрытие возможности редактирования данных аккаунта
        if(e.target.closest('.profile__button_save')) {
            const email = this.redraw.profile.email.value;
            const phone = this.redraw.profile.phone.value;
            const valid = this.validateUserData(email, phone);

            if(!valid.email || !valid.phone) {
                if(!valid.phone && this.instanceIMask) this.instanceIMask.destroy();
                this.redraw.profile.noValidUserData(valid);

                return;
            }
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


        // ---- address
        // снимаем юлокировку с поле при нажатии на редактирование
        if(e.target.closest('.profile__address-edit')) {
            this.redraw.profile.openEditForm('address');
        }
        // добавить адрес
        if(e.target.closest('.profile__button-add-adress')) {
            this.redraw.profile.openEditForm('address');
            this.redraw.profile.fillStartValue();
        }


        // ---- delete
        // вызов модалки удаления
        if(e.target.closest('.profile__delete')) { 
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

        
        // HISTORY
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
        if(e.target.closest('[name="phone"]')) {
            this.instanceIMask = new this.IMask(e.target, {
                mask: '+{7} (000) 000-00-00',
                lazy: false,
                placeholderChar: '_',
            })
        }

        this.redraw.profile.clearInput(e.target);
    }

    blur(e) {
        if(e.target.closest('[name="phone"]')) {
            const value = e.target.value;
            const result = /\+\d{1} \(___\) ___-__-__/.test(value);
            if(result) {
                this.instanceIMask.destroy();
                e.target.value = 'Телефон';
            }
        }
    
        if(!e.target.closest('[name="phone"]')) {
            this.redraw.profile.fillInput(e.target);
        }
    }

    // валидация пользовательских данных
    validateUserData(email, phone) {
        const data = {};
        if(email) data.phone = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/ig.test(phone);
        if(phone) data.email = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email);
        return data;
    }
}