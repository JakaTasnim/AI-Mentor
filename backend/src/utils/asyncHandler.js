const asyncHandler = (requestHandler) => {
    console.log("AsyncHandler function call");
    return (req, res, next) => {
        console.log("Return function call ");
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };