
// promise method
// creating this utility so that we dont have to write try catch block in every route handler
// just we can wrap the route handler in this utility and we can handle it.
const asyncHandler = (requestHandler) => {

    return (res, req, next) => {
        Promise.resolve(requestHandler(res, req, next)).catch((error) => next(error))
    }

}
export { asyncHandler }


