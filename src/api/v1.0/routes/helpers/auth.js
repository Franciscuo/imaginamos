const jwt = require('jsonwebtoken');
const response = require('./response');

const isAuthenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === undefined) return response.error(res, 'No header token', 403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return response.error(res, 'No valid token', 401);
        res.locals.user = user.id;
        next();
    });
};

module.exports = isAuthenticate;
