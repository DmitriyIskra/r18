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

    
    // КАРТА С ПВЗ
    initMap() {
        ymaps.ready(function () {
            // Создаем карту с указанными центром и уровнем масштабирования
            var myMap = new ymaps.Map("map", {
                center: [55.751574, 37.573856],
                controls: [],
                zoom: 9
              }),
              // Создаем кластеризатор с заданными опциями
              clusterer = new ymaps.Clusterer({
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false
              });
          
            // Переопределяем метод createCluster для кластеризатора
            clusterer.createCluster = function (center, geoObjects) {
              // Создаем кластерную метку с помощью стандартной реализации метода
              var clusterPlacemark = ymaps.Clusterer.prototype.createCluster.call(
                  this,
                  center,
                  geoObjects
                ),
                hasRed = false,
                hasViolet = false,
                hasYellow = false;
          
              // Проверяем, какие цвета меток присутствуют в кластере
              for (var i = 0, l = geoObjects.length; i < l; i++) {
                var placemarkPreset = geoObjects[i].options.get("preset");
                if (placemarkPreset === "islands#redIcon") {
                  hasRed = true;
                } else if (placemarkPreset === "islands#violetIcon") {
                  hasViolet = true;
                } else if (placemarkPreset === "islands#yellowIcon") {
                  hasYellow = true;
                }
              }
          
              // Устанавливаем цвет кластера на основе приоритета цветов
              var clusterPreset;
              if (hasRed) {
                clusterPreset = "islands#redClusterIcons";
              } else if (hasViolet) {
                clusterPreset = "islands#violetClusterIcons";
              } else if (hasYellow) {
                clusterPreset = "islands#yellowClusterIcons";
              }
          
              // Устанавливаем найденный пресет для кластера
              clusterPlacemark.options.set("preset", clusterPreset);
              return clusterPlacemark;
            };
          
            // Функция для создания данных балуна метки
            var getPointData = function (index) {
                return {
                  balloonContentBody: "балун <strong>метки " + index + "</strong>",
                  clusterCaption: "метка <strong>" + index + "</strong>"
                };
              },
              allowColors = ["red", "violet", "yellow"], // Разрешенные цвета меток
              // Функция для создания опций метки на основе ее цвета
              getPointOptions = function (point) {
                return {
                  preset: "islands#" + point.color + "Icon"
                };
              },
              // Массив точек с координатами и цветами
              points = [
                { coords: [55.831903, 37.411961], color: "red" },
                { coords: [55.763338, 37.565466], color: "violet" },
                { coords: [55.763338, 37.565466], color: "yellow" },
                { coords: [55.744522, 37.616378], color: "red" },
                { coords: [55.780898, 37.642889], color: "violet" },
                { coords: [55.793559, 37.435983], color: "yellow" },
                { coords: [55.800584, 37.675638], color: "red" },
                { coords: [55.716733, 37.589988], color: "violet" },
                { coords: [55.775724, 37.56084], color: "yellow" },
                { coords: [55.822144, 37.433781], color: "red" },
                { coords: [55.87417, 37.669838], color: "yellow" },
                { coords: [55.71677, 37.482338], color: "yellow" },
                { coords: [55.78085, 37.75021], color: "red" },
                { coords: [55.810906, 37.654142], color: "violet" },
                { coords: [55.865386, 37.713329], color: "yellow" },
                { coords: [55.847121, 37.525797], color: "red" },
                { coords: [55.778655, 37.710743], color: "violet" },
                { coords: [55.623415, 37.717934], color: "yellow" },
                { coords: [55.863193, 37.737], color: "red" },
                { coords: [55.86677, 37.760113], color: "violet" },
                { coords: [55.698261, 37.730838], color: "yellow" },
                { coords: [55.6338, 37.564769], color: "red" },
                { coords: [55.639996, 37.5394], color: "violet" },
                { coords: [55.69023, 37.405853], color: "yellow" },
                { coords: [55.77597, 37.5129], color: "red" },
                { coords: [55.775777, 37.44218], color: "violet" },
                { coords: [55.811814, 37.440448], color: "yellow" },
                { coords: [55.751841, 37.404853], color: "red" },
                { coords: [55.627303, 37.728976], color: "violet" },
                { coords: [55.816515, 37.597163], color: "yellow" },
                { coords: [55.664352, 37.689397], color: "red" },
                { coords: [55.679195, 37.600961], color: "violet" },
                { coords: [55.673873, 37.658425], color: "yellow" },
                { coords: [55.681006, 37.605126], color: "red" },
                { coords: [55.876327, 37.431744], color: "violet" },
                { coords: [55.843363, 37.778445], color: "yellow" },
                { coords: [55.875445, 37.549348], color: "red" },
                { coords: [55.662903, 37.702087], color: "violet" },
                { coords: [55.746099, 37.434113], color: "yellow" },
                { coords: [55.83866, 37.712326], color: "red" },
                { coords: [55.774838, 37.415725], color: "violet" },
                { coords: [55.871539, 37.630223], color: "yellow" },
                { coords: [55.657037, 37.571271], color: "red" },
                { coords: [55.691046, 37.711026], color: "violet" },
                { coords: [55.803972, 37.65961], color: "yellow" },
                { coords: [55.616448, 37.452759], color: "red" },
                { coords: [55.781329, 37.442781], color: "violet" },
                { coords: [55.844708, 37.74887], color: "yellow" },
                { coords: [55.723123, 37.406067], color: "red" },
                { coords: [55.858585, 37.48498], color: "violet" }
              ],
              geoObjects = [];
            // Создаем метки и добавляем их в массив geoObjects
            for (var i = 0, len = points.length; i < len; i++) {
              geoObjects[i] = new ymaps.Placemark(
                points[i]["coords"],
                getPointData(i),
                getPointOptions(points[i])
              );
            }
          
            // Добавляем все метки в кластеризатор
            clusterer.add(geoObjects);
            // Добавляем кластеризатор на карту
            myMap.geoObjects.add(clusterer);
          });
          
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