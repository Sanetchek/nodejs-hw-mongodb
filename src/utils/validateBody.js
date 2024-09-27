import createHttpError from "http-errors";

const validateBody = schema => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      const validateError = createHttpError(400, error.message);
      next(validateError);
    }
  };
};

export default validateBody;
