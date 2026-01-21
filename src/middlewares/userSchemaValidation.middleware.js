const joi = require("joi");
const ExpressError = require("../utils/ExpressError.util");

const userSchema = joi.object({
    name: joi.object({
        firstName: joi.string().required(),
        lastName: joi.string()
    }),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi.string().required().min(8)
})

const validateUserSchema = (req, res, next) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return next(new ExpressError(error.details[0].message, 400))
        }
        return next();
    } catch (error) {
        return next(new ExpressError("Data validation falied", 400));
    }
}

module.exports = validateUserSchema;