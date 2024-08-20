export default class RedrawAccountButton {
    constructor(el) {
        this.el = el;

        this.lastActiveModal = null;
    }

    incorrectData(input, text) {
        if(input.type === 'password') input.type = 'text';

        input.value = text;
        input.style.color = '#FF7C7C';
        input.dataset.invalid = 1;
    }

    openNewModal(modal) {
        if(this.lastActiveModal) this.lastActiveModal.remove();
        this.lastActiveModal = modal;

        document.body.append(modal);
    }

    closeModal(form) {
        this.lastActiveModal.remove();
        this.lastActiveModal = null;
    }
}