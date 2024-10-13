export default class ControllPlaceOrder {
    constructor(d) {
        this.d = d;

        this.click = this.click.bind(this);
    }

    init() {
        this.registerEvents();
    }

    registerEvents() {
        this.d.el.addEventListener('click', this.click);
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
    } 

    
}