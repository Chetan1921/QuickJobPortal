// middleware/TryCatch.ts

import {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";

type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const TryCatch = (
    passedFunction: AsyncFunction
): RequestHandler => {

    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            await passedFunction(req, res, next);

        } catch (error) {

            next(error);

        }

    };

};

export default TryCatch;