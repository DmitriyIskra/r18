export default class ControllChangePassword {
    constructor(d, api, validation) {
        this.d = d;
        this.api = api;
        this.validation = validation;

        this.click = this.click.bind(this);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.d.el.addEventListener('click', this.click);

        [...this.d.inputs].forEach(input => {
            input.addEventListener('focus', this.focus);
            input.addEventListener('blur', this.blur);
        })
    }

    click(e) {
        if(e.target.closest('.change-pass__button')) {
            [...this.d.inputs].forEach(input => {
                const result = this.validation.validate(e.target, [true, false, false]);
                // Поле не заполнено
                if(!result) this.d.noInputData(input);
            })
        }
    }

    focus(e) {
        const result = this.validation.validate(e.target, [true, false, false]);
        this.d.clearInput(e.target, result);
        
    }

    blur(e) {
        const result = this.validation.validate(e.target, [true, false, false]);
        this.d.fillInput(e.target, result);
    }
}