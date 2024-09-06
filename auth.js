const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Parth$123@$';

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role :user.role,
    }, SECRET_KEY, { expiresIn: '1h' }); // Optional: set an expiration time
}

function getUser(token) {
    if (!token) return null;
    
    try {
        // Verify the token and decode it
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            console.error('JWT Error:', error.message);
        } else {
            console.error('An error occurred:', error.message);
        }
        return null; // Return null or handle the error as needed
    }
}

module.exports = {
    setUser,
    getUser,
};
