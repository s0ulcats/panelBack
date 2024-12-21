const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/Bearer\s?/, '');

    if (!token) {
        console.warn('No token provided');
        return res.status(403).json({ message: 'No access' });
    }

    try {
        const decoded = jwt.verify(token, 'aswjodnfdfjknassdfgsdfvfqw9u2qe9r893');
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = checkAuth;
