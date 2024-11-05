export default class RedrawPlaceOrder {
    constructor(el) {
        this.el = el;

        this.checkboxAddress = this.el.querySelector('.place-order__type-address-check');
        this.selectAddress = this.el.querySelector('.place-order__type-address-select span');

        // контейнер c навигацией по способам доставки
        this.wrReceivingNav = this.el.querySelector('.place-order__receiving-wr-list');

        this.allTextInputs = this.el.querySelectorAll('input[type="text"]');
        this.buttonSend = this.el.querySelector('.place-order__button-submit');

        this.paymentTitle = this.el.querySelector('.place-order__payment-title');

        // визуальная часть пользовательского соглашения
        this.agreePersonalData = this.el.querySelector('.place-order__personal-data-label');
        // чекбокс пользовательского соглашения
        this.agreePersonalDataCheckbox = this.el.querySelector('.place-order__personal-data-input');

        
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
        this.wrTypeCdekNav = this.el.querySelector('.place-order__cdek-type');
        this.typeCdekNavInputs = this.el.querySelectorAll('.place-order__cdek-radio');

        // способы оплаты радио кнопки
        this.paymentNav = {
            cash : this.el.querySelector('.place-order__payment-type[data-payment_type="cash"]'),
            'card-site' : this.el.querySelector('.place-order__payment-type[data-payment_type="card-site"]'),
            'card-place' : this.el.querySelector('.place-order__payment-type[data-payment_type="card-place"]'),
            legal : this.el.querySelector('.place-order__payment-type[data-payment_type="legal"]'),
        }

        // КОНТЕНТ ФОРМЫ
        // --- способ получения
        // форма или текст для выбра способа получения
        this.receivingsContent = {
            moskow : this.el.querySelector('.place-order__forms-address-item[data-type="moskow"]'),
            'area-region' : this.el.querySelector('.place-order__forms-address-item[data-type="area-region"]'),
            pickup : this.el.querySelector('.place-order__forms-address-item[data-type="pickup"]'),
            cdek : this.el.querySelector('.place-order__forms-address-item[data-type="cdek"]'),
        }
        // форма которую показываем в зависимости от выбора курьер или пвз
        this.listCdek = {
            courier : this.el.querySelector('.place-order__forms-address-cdek-item[data-type="courier"]'),
            opp : this.el.querySelector('.place-order__forms-address-cdek-item[data-type="opp"]'),
        }
        // Форма для юр.лица
        this.formLegal = this.el.querySelector('.place-order__payment-form');

        // последняя активная кнопка для выбора способа получения
        this.currentReceivingNav = null;
        // последняя активная форма для способа получения
        this.currentReceivingContent = null;
        // последняя активная форма для способа получения cdek
        this.currentReceivingContentCdek = this.listCdek.courier;
        // последняя активная кнопка для выбора типа оплаты
        this.currentPayment = null;
        // последнее активное значение input
        this.lastValueInput = null;
    }

    
    // START УПРАВЛЕНИЕ ФОРМАМИ ПОЛУЧЕНИЯ

    // выбор (открытие форм и активация соответствующей радио кнопки) способа получения
    choiceReceiving(typeReceiving, typeContent) {
        if(this.currentReceivingNav) this.currentReceivingNav.classList.remove('place-order__receiving-item_active');
        if(this.currentReceivingContent) this.currentReceivingContent.classList.remove('place-order__forms-address-item_active');
        
        this.receivingsNav[typeReceiving].classList.add('place-order__receiving-item_active');

        
        this.receivingsContent[typeContent].classList.add('place-order__forms-address-item_active');
        if(typeContent !== 'cdek') {
            // если не сдек отключаем радио кнопки курьер или пвз
            this.wrTypeCdekNav.classList.remove('place-order__cdek-type_active');
            this.currentReceivingContentCdek.classList.remove('place-order__forms-address-cdek-item_active')
        };
        
        // если сдек включаем радио кнопку курьер
        // и первую форму (сбрасываем в начальное положение)
        if(typeContent === 'cdek') {
            this.wrTypeCdekNav.classList.add('place-order__cdek-type_active');
            this.choiceReceivingCdek('courier');
            this.typeCdekNavInputs[0].checked = true;
        };
        
        // блокируем или разблокируем способы оплаты в зависимости от выбора
        if(typeReceiving === 'cdek' || typeReceiving === 'regions') {
            this.blockingPayment();
        } else {
            this.unblockingPayment();
        }
        
        this.currentReceivingNav = this.receivingsNav[typeReceiving];
        this.currentReceivingContent = this.receivingsContent[typeContent];

        // показ и скрытие фразы: Ожидайте ответа менеджера для точного расчета доставки
        this.controllTextCountDelivery(typeReceiving);
    }
    // закрытие кастомного способа получения (форма для способа получения)
    closeReceiving() {
        if(this.currentReceivingNav) {
            this.currentReceivingNav.classList.remove('place-order__receiving-item_active');
            this.currentReceivingNav = null;
        }

        if(this.currentReceivingContent) {
            this.currentReceivingContent.classList.remove('place-order__forms-address-item_active');
            this.currentReceivingContent = null;
        }

        this.wrTypeCdekNav.classList.remove('place-order__cdek-type_active');
        this.currentReceivingContentCdek.classList.remove('place-order__forms-address-cdek-item_active');
        this.currentReceivingContentCdek = this.listCdek.courier;
        this.currentReceivingContentCdek.classList.add('place-order__forms-address-cdek-item_active');

        this.typeCdekNavInputs[0].checked = true;
    }
    // выбор способа получения сдек 
    // используется по кликам по радио кнопкам курьер и пвз
    // а также при выборе сдек для сброса в начало (курьер)
    choiceReceivingCdek(type) {
        if(this.currentReceivingContentCdek) {
            this.currentReceivingContentCdek.classList.remove('place-order__forms-address-cdek-item_active');
        }

        this.listCdek[type].classList.add('place-order__forms-address-cdek-item_active');
        
        this.currentReceivingContentCdek = this.listCdek[type];

        // скрытие селект с адресами по сдек ПВЗ
        this.showHideSelectAddress(type);
    }

    // END УПРАВЛЕНИЕ ФОРМАМИ ПОЛУЧЕНИЯ


    // показ и скрытие фразы: Ожидайте ответа менеджера для точного расчета доставки
    controllTextCountDelivery(current) {
        this.wrReceivingNav.dataset.current = current;
    }


    // START SELECT с адресами

    // выбор адреса (SELECT)
    setSelectAddress(value) {
        this.selectAddress.textContent = value;

        // если пользователь выберет уже сохраненный ранее 
        // тип адреса то закрываем форму кастомного адреса,
        // чтобы пользователь понимал что или то или то, чтоб ориентировался
        this.closeReceiving();
    }
    // скрытие селект с адресами по сдек ПВЗ
    showHideSelectAddress(type) {
        if(type === 'opp') this.wrReceivingNav.dataset.type_content = type;
        if(!type || type !== 'opp') this.wrReceivingNav.dataset.type_content = "";
    }

    // END SELECT с адресами



    // ---- START ОПЛАТА

    // выбор способа оплаты
    choicePayment(type) {
        if(this.currentPayment) this.currentPayment.classList.remove('place-order__payment-type_active');

        this.paymentNav[type].classList.add('place-order__payment-type_active');

        this.currentPayment = this.paymentNav[type];

        if(this.paymentTitle.classList.contains('place-order__form-input_invalid')) {
            this.paymentTitle.classList.remove('place-order__form-input_invalid');
        }
    }

    // блокировка способов оплаты
    blockingPayment() {
        this.paymentNav["card-place"].classList.add('place-order__payment-type_disabled');
        this.paymentNav.cash.classList.add('place-order__payment-type_disabled');

        if(this.paymentNav["card-place"].classList.contains('place-order__payment-type_active')) {
            this.paymentNav["card-place"].classList.remove('place-order__payment-type_active')
            this.currentPayment = null;
        }
        if(this.paymentNav.cash.classList.contains('place-order__payment-type_active')) {
            this.paymentNav.cash.classList.remove('place-order__payment-type_active')
            this.currentPayment = null;
        }
    }
    // разблокировка способов оплаты
    unblockingPayment() {
        this.paymentNav["card-place"].classList.remove('place-order__payment-type_disabled');
        this.paymentNav.cash.classList.remove('place-order__payment-type_disabled');
    }

    // ---- END ОПЛАТА




    // START РАБОТА С INPUT ФОРМ

    // очищает input при focus
    clearInput(input) {
        this.lastValueInput = input.value;

        input.value = '';
        input.classList.remove('place-order__form-input_required');

        if(input.classList.contains('place-order__form-input_invalid')) {
            input.classList.remove('place-order__form-input_invalid');
        }
    }

    // заполняет input предъидущим значением если при blur
    // ничего отличного от стартового value не было введено
    fillInputLastValue(input) {
        const standartValue = input.dataset.standart_value;
        const value = input.value;
        // если при blur input пустой возвращаем туда предыдущее значение
        if(!value) {
            input.value = this.lastValueInput; 
        }
        
        // значения не введено и старое совпадает со стандартным
        if(!value && this.lastValueInput === standartValue) input.classList.add('place-order__form-input_required');
        // значения введено и старое совпадает со стандартным
        if(value && value === standartValue) input.classList.add('place-order__form-input_required');
    }
    // END РАБОТА С INPUT ФОРМ


 
 

    // ПОДСВЕТКА НЕ ВАЛИДНЫХ ДАННЫХ ПРИ ОТПРАВКЕ
    // подсвечивает не валидные текстовые инпуты
    setInvalidInputText(input) {
        input.classList.add('place-order__form-input_invalid');
    }
    // подсвечивает если не выбран способ оплаты
    setInvalidPayment() {
        this.paymentTitle.classList.add('place-order__form-input_invalid');
    }
    // подсвечивает если не выбрано пользовательское соглашение
    setInvalidPersonalData() {
        this.agreePersonalData.classList.add('place-order__personal-data-agree_invalid');
    }
    // снимает подсветку если выбрано пользовательское соглашение
    removeInvalidPersonalData() {
        if(this.agreePersonalData.classList.contains('place-order__personal-data-agree_invalid')) {
            this.agreePersonalData.classList.remove('place-order__personal-data-agree_invalid');
        }
    } 
}