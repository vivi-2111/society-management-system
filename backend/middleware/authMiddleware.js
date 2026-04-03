const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied, no token' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded.user || decoded.admin; // fallback for older tokens if needed
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
