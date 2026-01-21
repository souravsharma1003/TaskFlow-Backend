const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError.util");

module.exports.authUser = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return next(new ExpressError("Unauthorized", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        return next();

    } catch (err) {
        return next(new ExpressError("Unauthorized", 401));
    }
};
