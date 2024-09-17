export default class RedrawAccountProfile {
    constructor(el) {
        this.el = el;

        this.form = this.el.querySelector('form');
        // все инпуты профайла пользователя 
        this.inputs = this.el.querySelectorAll('input');
        // инпуты без радио и пола
        this.inputsText = this.el.querySelectorAll('.profile__user-contacts-item > input');
        this.phone = this.form.phone;

        // кнопки профайла
        this.groupButtonsEdit = this.el.querySelector('.profile__buttons-group-edit');
        this.groupButtonSave = this.el.querySelector('.profile__buttons-group-save');

        // если в инпут ничего не ввели в профайле, чтоб было что вернуть
        this.lastInputValue = null;
    }

    // открываем возможность редактирования
    openEditProfile() {
        [...this.inputs].forEach(item => item.removeAttribute('disabled'));
        this.inputs[0].focus();
        
        this.changeGroupButton();
    }

    // закрываем возможность редактирования
    closeEditProfile() {
        [...this.inputs].forEach(item => item.setAttribute('disabled', ""));
        
        this.changeGroupButton();
    }

    // очистка input при focus
    clearInput(el) {
        console.log('clear');
        if(el.value) this.lastInputValue = el.value;
        
        el.value = '';
    }
    
    // заполнение input при blur если ничего не введено
    fillInput(el) {
        console.log('fill');
        // если при потере фокуса в нем нет value, но оно там было
        // ставим предидущий
        if(!el.value && this.lastInputValue) {
            el.value = this.lastInputValue;
        }

        if(!el.value && !this.lastInputValue) {
            el.placeholder = this.lastPlaceholder;
        }
    }

    changeGroupButton() {
        this.groupButtonsEdit.classList.toggle('profile__buttons-group-edit_active');
        this.groupButtonSave.classList.toggle('profile__buttons-group-edit_active');
    }
}