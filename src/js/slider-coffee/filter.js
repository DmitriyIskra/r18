export default class Filter {
    constructor(list) {
        this.list = list;

        this.createEl = null;
    }

    initial(arr) {
        this.rendering(arr);
    }

    rendering(data) {
        console.log(data)
        const arr = Array.from(data.entries());
        console.log(arr)
        for(let i = arr.length - 1 ; i >= 0; i -= 1) {
            console.log(arr[i])
            const li = document.createElement('li');
            li.classList.add('sl-prod__filter-item');
            li.classList.add('sl-prod__filter-type');
            li.id = arr[i][0];
            li.textContent = arr[i][1];
    
            this.list.prepend(li);
        }

    }
}