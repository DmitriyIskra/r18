import AirDatepicker from "air-datepicker";

export default class ControllAccount {
    constructor(redraw, AirDatepicker) {
        this.redraw = redraw;

        this.clickNav = this.clickNav.bind(this);
        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();

        this.redraw.history.initScroll();

        this.initCalendar();
    }

    initCalendar() {
        const inputDate = this.redraw.profile.form.born_date;
        new AirDatepicker(inputDate, {
            isMobile : innerWidth <= 1200 ? true : false,
            autoClose : true,
        });
    }

    registerEvents() {
        this.redraw.content.el.addEventListener('click', this.clickNav);
        this.redraw.profile.el.addEventListener('click', this.click);
        this.redraw.history.el.addEventListener('click', this.click);
    }

    click(e) {
        console.log(e.target)
        // открытие возможности редактирования
        if(e.target.closest('.profile__button_edit')) {
            this.redraw.profile.openEditProfile();
        }

        // закрытие возможности редактирования
        if(e.target.closest('.profile__button_save')) {
            const formData = new FormData(this.redraw.profile.form);
            console.log(Array.from(formData));

            this.redraw.profile.closeEditProfile();
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
}