export default class RedrawAccountProfile {
    constructor(el) {
        this.el = el;

        this.form = this.el.querySelector('form');
        // инпуты профайла пользователя
        this.inputs = this.el.querySelectorAll('input');

        // кнопки профайла
        this.groupButtonsEdit = this.el.querySelector('.profile__buttons-group-edit');
        this.groupButtonSave = this.el.querySelector('.profile__buttons-group-save');
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

    changeGroupButton() {
        this.groupButtonsEdit.classList.toggle('profile__buttons-group-edit_active');
        this.groupButtonSave.classList.toggle('profile__buttons-group-edit_active');
    }
}