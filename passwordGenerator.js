/**
 * @fileoverview Secure password generator using cryptographic random number generation
 */

const crypto = require("crypto");

/**
 * Generates a cryptographically secure random password
 * @param {number} [length=12] - Length of the password to generate (default: 12)
 * @returns {string} Generated password containing uppercase, lowercase, numbers, and special characters
 */
function generatePassword(length = 12) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        password += chars[randomIndex];
    }
    return password;
}

// Export function for use in the main app
module.exports = { generatePassword };