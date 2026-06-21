// middleware/ErrorMiddleware.ts

import {
    Request,
    Response,
    NextFunction,
} from "express";

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    console.log("❌ Error:", err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Errors",
    });

};