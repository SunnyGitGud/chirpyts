export class badRequest400 extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = "badRequestError";
        this.statusCode = 400;
    }
}
export class unAuthorized401 extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = "unAuthorizedError";
        this.statusCode = 401;
    }
}
export class forbidden403 extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = "forbiddenError";
        this.statusCode = 403;
    }
}
export class notFound404 extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = "notfoundError";
        this.statusCode = 404;
    }
}
export function MiddlewareErrHandle(err, _req, res, next) {
    console.error(err);
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        error: message
    });
    next();
}
