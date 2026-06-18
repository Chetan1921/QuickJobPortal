// middleware/TryCatch.ts
const TryCatch = (passedFunction) => {
    return async (req, res, next) => {
        try {
            await passedFunction(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
export default TryCatch;
