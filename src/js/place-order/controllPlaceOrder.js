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
            
            // когда выбрана та же кнопка что и в предыдущий раз все закрываем
            if(this.d.currentReceivingNav && 
                this.d.currentReceivingNav.dataset.receiving === typeReceiving) {
                this.d.closeReceiving();
                return;
            }

            // когда выбрана новая кнопка
            this.d.choiceReceiving(typeReceiving, typeContent);
            
            // // если при выборе сдек, активен ПВЗ скрыть select с адресами
            // if(this.d.typeCdekNavInputs.checked) this.d.choiceReceivingCdek('opp');
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
 
        // чек бокс с персональными данными
        if(e.target.closest('.place-order__personal-data-label')) {
            this.d.removeInvalidPersonalData();
        }

        // проводим ВАЛИДАЦИЮ обязательных полей при нажатии на кнопку ОФОРМИТЬ
        if(e.target.closest('.place-order__button-submit')) {
            // если выбрана какая-то форма СПОСОБА ПОЛУЧЕНИЯ 
            // 
            if(this.d.currentReceivingContent) {
                const activeType = this.d.currentReceivingNav.dataset.type;

                let form;
                if(activeType !== 'cdek') {
                    form = this.d.currentReceivingContent.querySelector('form');
                }

                if(activeType === 'cdek') {
                    form = this.d.currentReceivingContentCdek.querySelector('form');
                }

                let inputs;
                if(form) {
                    inputs = form.querySelectorAll('input[type="text"]');
                    
                    [...inputs].forEach(input => {
                        const validation = this.validationInputText(input);

                        if(!validation) this.d.setInvalidInputText(input);
                    });
                }
            }

            // СПОСОБ ОПЛАТЫ
            if(!this.d.currentPayment) {
                this.d.setInvalidPayment();
            }
            if(this.d.currentPayment && this.d.currentPayment.dataset.payment_type === 'legal') {
                const inputs = this.d.formLegal.querySelectorAll('input[type="text"]');
                [...inputs].forEach(input => {
                    const validation = this.validationInputText(input);
                    if(!validation) this.d.setInvalidInputText(input);
                });
            }

            // СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ 
            if(!this.d.agreePersonalDataCheckbox.checked) {
                this.d.setInvalidPersonalData();
            }
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

    // валидация текстовых инпутов в формах
    validationInputText(input) {
        const value = input.value;

        let result;

        // для всех инпутов, кроме CDEK ПВЗ
        if(input.dataset?.standart_value) {
            const standartValue = input.dataset.standart_value;
            result = value !== standartValue;
            return result;
        }

        // для инпута CDEK ПВЗ
        result = value !== '' ? true : false;

        return result;
    }
}