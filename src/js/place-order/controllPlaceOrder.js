export default class ControllPlaceOrder {
    constructor(d) {
        this.d = d;

        this.click = this.click.bind(this);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.d.el.addEventListener('click', this.click);

        [...this.d.allTextInputs].forEach(input => input.addEventListener('focus', this.focus));
        [...this.d.allTextInputs].forEach(input => input.addEventListener('blur', this.blur));
    }

    click(e) {
        // переключение способа получения
        if(e.target.closest('.place-order__receiving-item')) {
            const element = e.target.closest('.place-order__receiving-item');
            const typeReceiving = element.dataset.receiving;
            const typeContent = element.dataset.type;

            this.d.choiceReceiving(typeReceiving, typeContent);
        }

        // переключение способа получения СДЕК
        if(e.target.closest('.place-order__cdek-type-label')) {
            const element = e.target.closest('.place-order__cdek-type-label');
            const type = element.dataset.type;
     
            this.d.choiceReceivingCdek(type);
        }

        // выбор способа оплаты
        if(e.target.closest('.place-order__payment-type')) {
            const element = e.target.closest('.place-order__payment-type');
            const type = element.dataset.payment_type;
     
            this.d.choicePayment(type);
        }

        // выбор адреса (select)
        if(e.target.closest('.place-order__type-address-item')) {
            const element = e.target.closest('.place-order__type-address-item');
            const value = element.textContent;
     
            this.d.setSelectAddress(value);
        }
    } 

    focus(e) {
        if(e.target.closest('input[type="text"]')) {
            this.d.clearInput(e.target.closest('input[type="text"]'));
        }
    }

    blur(e) {
        if(e.target.closest('input[type="text"]')) {
            this.d.fillInputLastValue(e.target.closest('input[type="text"]'));
        }
    }
}