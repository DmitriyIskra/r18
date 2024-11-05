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
            // проверяем на заполненность полей
            const isFill = [];
            [...this.d.inputs].forEach(input => {
                const result = this.validation.fillInput(input);

                // Поле не заполнено
                if(!result) {
                    this.d.noInputData(input);
                };
                isFill.push(result);
            })
            // останввливаем когда хоть одно поле пустое
            if(isFill.includes(false)) return;

            // проверяем на соответствие пароля шаблону
            const isPattern = this.validation.patternPass(this.d.form.pass);
            if(!isPattern) return;

            // проверка на совпадение
            const isSame = this.validation.isSamePass([...this.d.inputs]);
            if(!isSame) return


            
        }
    }

    focus(e) {
        const result = this.validation.fillInput(e.target);
        this.d.clearInput(e.target, result);
    }

    blur(e) {
        const result = this.validation.fillInput(e.target);
        this.d.fillInput(e.target, result);
    }
}