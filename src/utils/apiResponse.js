class apiResponse {
    // creating this utility so that we can throw responses in a consistent way
    // and we can handle them in a consistent way.
    constructor(statusCode, data, message = "Sucess") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.sucess = statusCode < 400

    }
}
// status code less than 400 are responses and greater than 400 are errors

export { apiResponse }