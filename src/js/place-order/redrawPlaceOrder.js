export default class RedrawPlaceOrder {
    constructor(el) {
        this.el = el;

        this.checkboxAddress = this.el.querySelector('.place-order__type-address-check');
        this.selectAddress = this.el.querySelector('.place-order__type-address-select span');

        this.allTextInputs = this.el.querySelectorAll('input[type="text"]');
        
        // НАВИГАЦИИ
        // --- способ получения
        // радио кнопки для выбра способа получения
        this.receivingsNav = {
            moskow : this.el.querySelector('.place-order__receiving-item[data-receiving="moskow"]'),
            'moskow-area' : this.el.querySelector('.place-order__receiving-item[data-receiving="moskow-area"]'),
            'regions' : this.el.querySelector('.place-order__receiving-item[data-receiving="regions"]'),
            'pickup' : this.el.querySelector('.place-order__receiving-item[data-receiving="pickup"]'),
            'cdek' : this.el.querySelector('.place-order__receiving-item[data-receiving="cdek"]'),
        }

        // радио кнопки с вариантами курьер и ПВЗ
        this.typeCdekNav = this.el.querySelector('.place-order__cdek-type');

        // способы оплаты
        this.paymentNav = {
            cash : this.el.querySelector('.place-order__payment-type[data-payment_type="cash"]'),
            'card-site' : this.el.querySelector('.place-order__payment-type[data-payment_type="card-site"]'),
            'card-place' : this.el.querySelector('.place-order__payment-type[data-payment_type="card-place"]'),
            legal : this.el.querySelector('.place-order__payment-type[data-payment_type="legal"]'),
        }

        // КОНТЕНТ
        // --- способ получения
        // контент для выбра способа получения
        this.receivingsContent = {
            moskow : this.el.querySelector('.place-order__forms-address-item[data-type="moskow"]'),
            'area-region' : this.el.querySelector('.place-order__forms-address-item[data-type="area-region"]'),
            pickup : this.el.querySelector('.place-order__forms-address-item[data-type="pickup"]'),
            cdek : this.el.querySelector('.place-order__forms-address-item[data-type="cdek"]'),
        }
        // контент которые показываем в зависимости от выбора курьер или пвз
        this.listCdek = {
            courier : this.el.querySelector('.place-order__forms-address-cdek-item[data-type="courier"]'),
            opp : this.el.querySelector('.place-order__forms-address-cdek-item[data-type="opp"]'),
        }


        // последний активный кнопка для выбора способа получения
        this.currentReceivingNav = null;
        // последний активный контент для способа получения
        this.currentReceivingContent = null;
        // последний активный контент для способа получения cdek
        this.currentReceivingContentCdek = this.listCdek.courier;
        // последний активный кнопка для выбора типа оплаты
        this.currentPayment = null;
        // последнее активное значение input
        this.lastValueInput = null;
    }

    // выбор способа получения
    choiceReceiving(typeReceiving, typeContent) {
        if(this.currentReceivingNav) this.currentReceivingNav.classList.remove('place-order__receiving-item_active');
        if(this.currentReceivingContent) this.currentReceivingContent.classList.remove('place-order__forms-address-item_active');

        this.receivingsNav[typeReceiving].classList.add('place-order__receiving-item_active');

        this.receivingsContent[typeContent].classList.add('place-order__forms-address-item_active');

        if(typeContent !== 'cdek') {
            // если не сдек отключаем радио кнопки курьер или пвз
            this.typeCdekNav.classList.remove('place-order__cdek-type_active');
        };

        // если сдек включаем радио кнопки курьер или пвз
        if(typeContent === 'cdek') this.typeCdekNav.classList.add('place-order__cdek-type_active');

        // блокируем или разблокируем способы оплаты в зависимости от выбора
        if(typeReceiving === 'cdek' || typeReceiving === 'regions') {
            this.blockingPayment();
        } else {
            this.unblockingPayment();
        }

        this.currentReceivingNav = this.receivingsNav[typeReceiving];
        this.currentReceivingContent = this.receivingsContent[typeContent];
    }

    // выбор способа получения сдек
    choiceReceivingCdek(type) {
        if(this.currentReceivingContentCdek) {
            this.currentReceivingContentCdek.classList.remove('place-order__forms-address-cdek-item_active');
        }
     
        this.listCdek[type].classList.add('place-order__forms-address-cdek-item_active');

        this.currentReceivingContentCdek = this.listCdek[type];
    }

    // выбор способа оплаты
    choicePayment(type) {
        if(this.currentPayment) this.currentPayment.classList.remove('place-order__payment-type_active');

        this.paymentNav[type].classList.add('place-order__payment-type_active');

        this.currentPayment = this.paymentNav[type];
    }

    // блокировка способов оплаты
    blockingPayment() {
        this.paymentNav["card-place"].classList.add('place-order__payment-type_disabled');
        this.paymentNav.cash.classList.add('place-order__payment-type_disabled');

        if(this.paymentNav["card-place"].classList.contains('place-order__payment-type_active')) {
            this.paymentNav["card-place"].classList.remove('place-order__payment-type_active')
        }
        if(this.paymentNav.cash.classList.contains('place-order__payment-type_active')) {
            this.paymentNav.cash.classList.remove('place-order__payment-type_active')
        }
    }
    // разблокировка способов оплаты
    unblockingPayment() {
        this.paymentNav["card-place"].classList.remove('place-order__payment-type_disabled');
        this.paymentNav.cash.classList.remove('place-order__payment-type_disabled');
    }



    // выбор адреса (select)
    setSelectAddress(value) {
        this.selectAddress.textContent = value;
    }


    clearInput(input) {
        this.lastValueInput = input.value;

        input.value = '';
        input.classList.remove('place-order__form-input_required');
    }

    fillInputLastValue(input) {
        input.value = this.lastValueInput;
        input.classList.add('place-order__form-input_required');
    }
}