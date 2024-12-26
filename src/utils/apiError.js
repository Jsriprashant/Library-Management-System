class apiError extends Error {
    // overriding the base class constructor
    // creating this utility so that we can throw errors in a consistent way
    // and we can handle them in a consistent way
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {

        super(message) // call to super class constructor
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }


    }
}

export { apiError }