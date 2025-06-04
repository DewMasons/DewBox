const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    // user can be an object with id and email, or just id/email
    const payload = typeof user === 'object' ? { id: user.id || user._id, email: user.email } : { id: user };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};
