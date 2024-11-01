export default class ApiAccountButton {
    async create(data) {
        try {
            const response = await fetch('path', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'multipart/form-data'
                },
                body : data
            })

            return false;
        } catch (error) {
            return false;
        }
    }
}