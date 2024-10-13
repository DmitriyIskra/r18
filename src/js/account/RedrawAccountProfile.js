export default class RedrawAccountProfile {
    constructor(el) {
        this.el = el;

        // все инпуты профайла пользователя личных данных пользователя и адреса
        this.inputsForms = {
            'user-data' : this.el.querySelectorAll('.profile__user-contacts-form input'),
            address : this.inputsUserAddress = this.el.querySelectorAll('.profile__address-form input'),
        }
        // USER DATA
        this.formUserData = this.el.querySelector('form');
        // инпуты без радио, пола личных данных пользователя
        this.inputsUserDataText = this.el.querySelectorAll('.profile__user-contacts-item > input');

        this.phone = this.formUserData.phone;
        this.email = this.formUserData.email;

        // кнопки профайла
        this.groupButtonsEdit = this.el.querySelector('.profile__buttons-group-edit');
        this.groupButtonSave = this.el.querySelector('.profile__buttons-group-save');

        // если в инпут ничего не ввели в профайле, чтоб было что вернуть
        this.lastInputValue = null;

        // ADDRESS
        // чекбокс для открытия списка имен адресов
        this.addressSelectCheckbox = this.el.querySelector('#profile__wr-address-checkbox');
        // Селект где отображается имя выбранного адреса если он есть
        this.addressesSelect = this.el.querySelector('.profile__wr-address-title');
        // список адресов
        this.addresses = this.el.querySelectorAll('.profile__address-item');

        // инпуты адреса пользователя
        this.buttonAddAdress = this.el.querySelector('.profile__button-add-adress');
        this.buttonSaveAdress = this.el.querySelector('.profile__button-save-adress');
    }

    // открываем редактирование формы
    openEditForm(type) {
        [...this.inputsForms[type]].forEach(item => item.removeAttribute('disabled'));

        this.inputsForms[type][0].focus();

        if(type === 'user-data') this.changeGroupButton();

        if(type === 'address') this.buttonSaveAdress.classList.remove('profile__button_disabled');
    }

    // закрываем возможность редактирования
    closeEditForm(type) {
        [...this.inputsForms[type]].forEach(item => item.setAttribute('disabled', ""));
        
        if(type === 'user-data') this.changeGroupButton();

        if(type === 'address') {
            this.buttonSaveAdress.classList.add('profile__button_disabled');
            this.buttonSaveAdress.removeAttribute('no-valid');
        };
    }

    // USER DATA
    // открываем возможность редактирования


    // очистка input при focus
    clearInput(el) {
        if(el.value) this.lastInputValue = el.value;

        if(el.hasAttribute('no-valid')) el.removeAttribute('no-valid');
        
        if(!el.closest('[name="phone"]')) el.value = '';
 
        if(el.closest('.profile__address-input')) el.classList.remove('profile__address-input_required');
    }
    
    // заполнение input при blur
    fillInput(el) {
        // если при потере фокуса в нем нет value, но оно там было
        // ставим предидущий
        if(!el.value && this.lastInputValue) {
            el.value = this.lastInputValue;

            if(this.lastInputValue === 'Неверно указана почта') {
                this.noValidUserData({email: false});
            }

            // для адреса, определяем необходимость и ставим или нет звездочку
            if(el.closest('.profile__address-input')) {
                const dataValue = el.dataset.value;
                if(dataValue === this.lastInputValue) {
                    el.classList.add('profile__address-input_required');
                }
                // если в форме уже были не валидные значения и в данном поле
                // при потере фокуса стандартное значение, значит показываем что оно не валидно
                if(this.buttonSaveAdress.hasAttribute('no-valid') && dataValue === this.lastInputValue) {
                    this.noValidUserAddress([el]);
                }
            }
        }

        if(!el.value && !this.lastInputValue) {
            el.placeholder = this.lastPlaceholder;
        }
    }

    // переключает кнопки под формой с данными пользователя
    changeGroupButton() {
        this.groupButtonsEdit.classList.toggle('profile__buttons-group-edit_active');
        this.groupButtonSave.classList.toggle('profile__buttons-group-edit_active');
    }

    // заполняет ошибками поля с данными пользователя (не адрес)
    noValidUserData(data) {
        if(!data?.email) {
            this.email.value = 'Неверно указана почта';
            this.email.setAttribute('no-valid', '');
        }
        
        if(!data?.phone) {
            this.phone.value = 'Неверно указан номер телефона';
            this.phone.setAttribute('no-valid', '');
        }
    }


    // ADDRESS

    // показ в селект выбранного имени адреса при старте страницы
    setStartAddress() {
        if(this.addresses.length) {
            const value = this.addresses[0].textContent;
            this.addressesSelect.textContent = value;
        }

        this.countAddresses();
    }
    // показ в селект выбранного имени адреса при выборе
    choiceAddressName(value) {
        this.addressesSelect.textContent = value;
        // закрываем селект
        this.addressSelectCheckbox.checked = false;
    }

    /**
     * при добавлении нового адреса, меняет данные в форме на 
     * стандартные стартовые и устанавливает метку обязательных
     * для заполнения полей
     * */ 
    fillStartValue() { 
        [...this.inputsForms['address']].forEach(input => {
            const dataValue = input.dataset.value;
            const value = input.value;

            // если поле не в фокусе и у него есть value и оно не стандартное
            if(value && dataValue !== value) input.value = dataValue;
            // если поле не в фокусе и унего соответственно не очищен value
            if(value) input.classList.add('profile__address-input_required');
        })
    }

    // показываем не валидные поля пользователю
    noValidUserAddress(elements) {
        elements.forEach(el => el.setAttribute('no-valid', ''));

        this.buttonSaveAdress.setAttribute('no-valid', '');
    }

    countAddresses() {
        if(this.addresses.length === 3) this.buttonAddAdress.style.display = 'none';
    }
}