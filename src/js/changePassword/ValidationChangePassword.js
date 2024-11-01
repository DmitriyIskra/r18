export default class ValidationChangePassword {
    constructor() {

    }

    /**
     * fill - запонение поля true/false
     * pattern - соответствие шаблону true/false
     * same - сравнение двух паролей true/false
     * 
     * data - одно значение или массив из 2х значений если параметр same true
     * */ 
    validate(data, params) {
        const [fill, pattern, same] = params;

        // по одному параметру
        if(fill, !pattern, !same) {
            const value = data.value;

            return value ? true : false
        }

        if(!fill, pattern, !same) {

        }

        if(!fill, !pattern, same) {

        }

        // по двум параметрам
        if(fill, pattern, !same) {

        }

        if(fill, !pattern, same) {

        }

        if(!fill, pattern, same) {

        }
        

        // по трем параметрам
        if(fill, pattern, same) {

        }
    }

    fillInput() {

    }

    patternPass() {

    }

    isSamePass() {

    }
}