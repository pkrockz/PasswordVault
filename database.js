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

// Password Schema
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

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex'); 

// Load Users
const loadUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    } catch (error) {
        return []; // Return empty array if file doesn't exist
    }
};

// Save Users
const saveUsers = (users) => fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

// Register User
const createUser = (username, password) => {
    const users = loadUsers();
    if (users.some(user => user.username === username)) return false; // User exists
    users.push({ username, password: hashPassword(password) });
    saveUsers(users);
    return true;
};

// Authenticate User
const authUser = (username, password) => {
    const users = loadUsers();
    const user = users.find(user => user.username === username);
    return user && user.password === hashPassword(password);
};

// Store Password
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

// Retrieve Password
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

// Delete Password
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