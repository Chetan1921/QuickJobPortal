// middleware/ErrorMiddleware.ts
export const ErrorMiddleware = (err, req, res, next) => {
    console.log("❌ Error:", err);
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
