/**
 * @fileoverview Cryptographic utilities for password encryption and decryption
 * Uses AES-256-CBC encryption with unique initialization vectors
 */

const crypto = require("crypto");

const algorithm = "aes-256-cbc"; // AES encryption algorithm
const secretKey = crypto.createHash('sha256').update('your-secure-password-key').digest(); // 32-byte key

/**
 * Encrypts a password using AES-256-CBC encryption
 * @param {string} password - Plain text password to encrypt
 * @returns {{encryptedPassword: string, iv: string}} Object containing encrypted password and IV in hex format
 */
const encryptPassword = (password) => {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each password
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return both IV and encrypted password
    return { encryptedPassword: encrypted, iv: iv.toString('hex') };
};

/**
 * Decrypts an encrypted password using AES-256-CBC decryption
 * @param {string} encryptedPassword - Encrypted password in hex format
 * @param {string} iv - Initialization vector in hex format
 * @returns {string|null} Decrypted plain text password or null if decryption fails
 */
const decryptPassword = (encryptedPassword, iv) => {
    try {
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("❌ Decryption failed:", error.message);
        return null;
    }
};

// Export functions for use in the main app
module.exports = { encryptPassword, decryptPassword };