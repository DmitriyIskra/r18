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
        console.log('open')
    }

    // USER DATA
    // открываем возможность редактирования

    // закрываем возможность редактирования
    closeEditProfile() {
        [...this.inputsForms['user-data']].forEach(item => item.setAttribute('disabled', ""));
        
        this.changeGroupButton();
    }

    // очистка input при focus
    clearInput(el) {
        if(el.value) this.lastInputValue = el.value;

        if(el.hasAttribute('no-valid')) el.removeAttribute('no-valid');
        
        if(!el.closest('[name="phone"]')) el.value = '';
 
        if(el.closest('.profile__address-input')) el.classList.remove('profile__address-input_required');
        console.log('clear')
    }
    
    // заполнение input при blur если ничего не введено
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
            }
        }

        if(!el.value && !this.lastInputValue) {
            el.placeholder = this.lastPlaceholder;
        }
    }

    changeGroupButton() {
        this.groupButtonsEdit.classList.toggle('profile__buttons-group-edit_active');
        this.groupButtonSave.classList.toggle('profile__buttons-group-edit_active');
    }

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
            console.log('fill')
        })
    }
}