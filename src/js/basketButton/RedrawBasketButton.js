export default class RedrawBasketButton {
    constructor(el) {
        this.el = el;

        this.lastActiveModal = null;
    }

    incorrectData(input, text) {
        if(input.type === 'password') input.type = 'text';

        input.value = text;
        input.style.color = '#FF7C7C';
        input.dataset.invalid = 1;

        // при фокусе на поле возвращаем стандартный вид
        // если были изменения при вводе не валидных данных
        input.addEventListener('focus', () => {
            input.style.color = '#fff';
            input.value = '';
            input.dataset.invalid = '';
            if(input.name === 'password') input.type = 'password';
        }, { once : true })
    }

    // изменение количества товара
    calcAmountGoods(button) {
        const type = button.dataset.type;

        let amount;
        let num;

        if(type === 'decrement') {
            amount = button.nextElementSibling;

            num = +amount?.value;
            if(+amount.value === 0) return;
            amount.value = num - 1;
        }

        if(type === 'increment') {
            amount = button.previousElementSibling;

            num = +amount?.value;
            amount.value = num + 1;
        }
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