# PasswordVault 🔐

A secure command-line password manager built with Node.js and MongoDB. PasswordVault helps you store, retrieve, and manage your passwords with military-grade AES-256 encryption.

## ✨ Features

- 🔒 **Secure Encryption**: AES-256-CBC encryption for all stored passwords
- 👤 **Multi-User Support**: Create multiple user accounts with secure authentication
- 🎲 **Password Generator**: Built-in cryptographically secure password generator
- 💾 **MongoDB Storage**: Reliable database storage with Mongoose ODM
- 🎨 **User-Friendly CLI**: Interactive command-line interface with emoji indicators
- 🔑 **Auto-Generate**: Option to auto-generate strong passwords when storing credentials

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v12.0.0 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pkrockz/PasswordVault.git
   cd PasswordVault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Linux/macOS
   sudo systemctl start mongod
   # or
   mongod
   
   # On Windows
   net start MongoDB
   ```

4. **Run the application**
   ```bash
   node app.js
   ```

## 📖 Usage

### First Time Setup

When you run the application for the first time, you'll be prompted to create a new user:

```
🆕 Do you want to register a new user? (yes/no): yes
👤 Enter new username: john
🔑 Enter new password: ********
✅ User 'john' created successfully!
```

### Login

After creating a user (or on subsequent runs), log in with your credentials:

```
🔐 Welcome to Password Vault!
👤 Enter username: john
🔑 Enter password: ********
✅ Successfully logged in as john
```

### Main Menu

Once logged in, you can choose from the following options:

```
📌 Menu:
1️⃣ Store a password
2️⃣ Retrieve a password
3️⃣ Delete a password
4️⃣ Logout & Exit
```

#### 1. Store a Password

Store credentials for any service:

```
👉 Choose an option: 1
🔹 Enter service name: Gmail
🔹 Enter username: john@example.com
🔹 Enter password (leave empty to generate): 
🔑 Generated Password: aB3$xY9#mK2@
✅ Password saved for Gmail and john@example.com
```

**Note**: Leave the password field empty to auto-generate a secure password.

#### 2. Retrieve a Password

Retrieve stored credentials:

```
👉 Choose an option: 2
🔹 Enter service name: Gmail
🔹 Enter username: john@example.com
🔑 Password for Gmail: aB3$xY9#mK2@
```

#### 3. Delete a Password

Remove stored credentials:

```
👉 Choose an option: 3
🔹 Enter service name: Gmail
🔹 Enter username: john@example.com
✅ Deleted password for Gmail
```

## 🏗️ Project Structure

```
PasswordVault/
├── app.js                  # Main application entry point
├── database.js             # MongoDB connection and database operations
├── cryptoUtils.js          # Encryption/decryption utilities
├── passwordGenerator.js    # Secure password generation
├── users.json              # Local user credentials storage (auto-created)
└── README.md              # Project documentation
```

### File Descriptions

- **app.js**: Contains the CLI interface and main application flow
- **database.js**: Handles MongoDB connection, user authentication, and password CRUD operations
- **cryptoUtils.js**: Implements AES-256-CBC encryption and decryption
- **passwordGenerator.js**: Generates cryptographically secure random passwords
- **users.json**: Stores hashed user credentials (created automatically on first user registration)

## 🔐 Security Features

### Password Encryption
- **Algorithm**: AES-256-CBC (Advanced Encryption Standard)
- **Key Size**: 256 bits
- **Unique IV**: Each password gets a unique initialization vector
- **Secure Storage**: Encrypted passwords stored in MongoDB

### User Authentication
- **Password Hashing**: SHA-256 hash for user passwords
- **Local Storage**: User credentials stored in local JSON file
- **Session Management**: User must authenticate before accessing vault

### Password Generation
- **Cryptographic Random**: Uses Node.js `crypto.randomInt()` for secure randomness
- **Character Set**: Includes uppercase, lowercase, numbers, and special characters
- **Customizable Length**: Default 12 characters (can be modified in code)

## ⚙️ Configuration

### MongoDB Connection

The default MongoDB connection URI is:
```
mongodb://localhost:27017/passwordVault
```

To change this, edit the `mongoURI` variable in `database.js`.

### Encryption Key

**⚠️ IMPORTANT**: Before using in production, change the encryption key in `cryptoUtils.js`:

```javascript
const secretKey = crypto.createHash('sha256').update('your-secure-password-key').digest();
```

Replace `'your-secure-password-key'` with a strong, unique secret key.

## 🛠️ Dependencies

- **mongoose**: MongoDB object modeling tool
- **readline**: Built-in Node.js module for interactive CLI
- **crypto**: Built-in Node.js module for cryptographic operations
- **fs**: Built-in Node.js module for file system operations

## 📝 Notes

- Each user has their own isolated password vault
- Duplicate entries (same service + username + user) are automatically updated
- MongoDB creates a unique index to prevent duplicate password entries
- User credentials are stored locally in `users.json` with SHA-256 hashing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available for educational purposes.

## ⚠️ Disclaimer

This is a learning project. For production use, consider additional security measures such as:
- Environment variables for sensitive configuration
- Master password for encryption key derivation
- Password strength validation
- Rate limiting for authentication attempts
- Two-factor authentication
- Secure key management system

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check if MongoDB is listening on port 27017
- Verify MongoDB installation: `mongod --version`

### Permission Errors
- Ensure you have write permissions in the application directory (for `users.json`)
- Check MongoDB data directory permissions

### Module Not Found
- Run `npm install` to install all dependencies
- Ensure you're in the correct directory

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Password Managing! 🔒**
