/**
 * @fileoverview Database module for PasswordVault
 * Handles MongoDB connection, user authentication, and password CRUD operations
 */

const mongoose = require("mongoose");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { encryptPassword, decryptPassword } = require("./cryptoUtils");
const { generatePassword } = require("./passwordGenerator");

// MongoDB Connection
const mongoURI = "mongodb://localhost:27017/passwordVault";
mongoose.connect(mongoURI);

mongoose.connection.on("connected", () => console.log("✅ Connected to MongoDB"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));

/**
 * MongoDB schema for storing encrypted passwords
 * @typedef {Object} PasswordSchema
 * @property {string} service - Name of the service (e.g., 'Gmail', 'Facebook')
 * @property {string} username - Username/email for the service
 * @property {string} user - The vault owner (logged-in user)
 * @property {string} encryptedPassword - AES-256 encrypted password
 * @property {string} iv - Initialization vector used for encryption
 */
const passwordSchema = new mongoose.Schema({
    service: { type: String, required: true },
    username: { type: String, required: true },
    user: { type: String, required: true }, // The logged-in user
    encryptedPassword: { type: String, required: true },
    iv: { type: String, required: true }
});

passwordSchema.index({ service: 1, username: 1, user: 1 }, { unique: true }); // Prevent duplicates

const Password = mongoose.model("Password", passwordSchema);

// User Credentials File
const usersFilePath = path.join(__dirname, 'users.json');

/**
 * Hashes a password using SHA-256
 * @param {string} password - Plain text password to hash
 * @returns {string} Hexadecimal hash of the password
 */
const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex'); 

/**
 * Loads users from the local JSON file
 * @returns {Array<{username: string, password: string}>} Array of user objects
 */
const loadUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    } catch (error) {
        return []; // Return empty array if file doesn't exist
    }
};

/**
 * Saves users array to the local JSON file
 * @param {Array<{username: string, password: string}>} users - Array of user objects to save
 */
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

/**
 * Creates a new user account
 * @param {string} username - Desired username
 * @param {string} password - Plain text password (will be hashed)
 * @returns {boolean} True if user created successfully, false if user already exists
 */
const createUser = (username, password) => {
    const users = loadUsers();
    if (users.some(user => user.username === username)) return false; // User exists
    users.push({ username, password: hashPassword(password) });
    saveUsers(users);
    return true;
};

/**
 * Authenticates a user by checking credentials
 * @param {string} username - Username to authenticate
 * @param {string} password - Plain text password to verify
 * @returns {boolean} True if credentials are valid, false otherwise
 */
const authUser = (username, password) => {
    const users = loadUsers();
    const user = users.find(user => user.username === username);
    return user && user.password === hashPassword(password);
};

/**
 * Stores or updates an encrypted password in the database
 * @async
 * @param {string} service - Name of the service
 * @param {string} username - Username for the service
 * @param {string|null} password - Password to store (null to auto-generate)
 * @param {string} user - The vault owner (logged-in user)
 * @returns {Promise<void>}
 */
async function storePassword(service, username, password = null, user) {
    try {
        if (!password) {
            password = generatePassword();
            console.log(`🔑 Generated Password: ${password}`);
        }

        const { encryptedPassword, iv } = encryptPassword(password);

        // Check if password already exists for the user
        const existingPassword = await Password.findOne({ service, username, user });
        if (existingPassword) {
            existingPassword.encryptedPassword = encryptedPassword;
            existingPassword.iv = iv;
            await existingPassword.save();
            console.log(`✅ Updated password for ${service} and ${username}`);
        } else {
            await new Password({ service, username, user, encryptedPassword, iv }).save();
            console.log(`✅ Password saved for ${service} and ${username}`);
        }
    } catch (error) {
        console.error("❌ Error saving password:", error);
    }
}

/**
 * Retrieves and decrypts a password from the database
 * @async
 * @param {string} service - Name of the service
 * @param {string} username - Username for the service
 * @param {string} user - The vault owner (logged-in user)
 * @returns {Promise<string|null>} Decrypted password or null if not found
 */
async function retrievePassword(service, username, user) {
    try {
        const entry = await Password.findOne({ service, username, user });
        if (!entry) {
            console.log("❌ No password found.");
            return null;
        }
        const decryptedPassword = decryptPassword(entry.encryptedPassword, entry.iv);
        console.log(`🔑 Password for ${service}: ${decryptedPassword}`);
        return decryptedPassword;
    } catch (error) {
        console.error("❌ Error retrieving password:", error);
        return null;
    }
}

/**
 * Deletes a password entry from the database
 * @async
 * @param {string} service - Name of the service
 * @param {string} username - Username for the service
 * @param {string} user - The vault owner (logged-in user)
 * @returns {Promise<void>}
 */
async function deletePassword(service, username, user) {
    try {
        const result = await Password.findOneAndDelete({ service, username, user });
        console.log(result ? `✅ Deleted password for ${service}` : "❌ No password found.");
    } catch (error) {
        console.error("❌ Error deleting password:", error);
    }
}

// Export functions
module.exports = {
    storePassword,
    retrievePassword,
    deletePassword,
    createUser,
    authUser
};