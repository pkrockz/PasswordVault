# API Documentation

This document provides detailed documentation for the internal API functions used in PasswordVault.

## Table of Contents

- [app.js](#appjs)
- [database.js](#databasejs)
- [cryptoUtils.js](#cryptoutilsjs)
- [passwordGenerator.js](#passwordgeneratorjs)

---

## app.js

Main application entry point providing the CLI interface.

### Functions

#### `askQuestion(question)`

Prompts user for input and returns a promise with the answer.

**Parameters:**
- `question` (string): The question to ask the user

**Returns:**
- `Promise<string>`: The user's response

**Example:**
```javascript
const answer = await askQuestion("Enter your name: ");
console.log(`Hello, ${answer}!`);
```

---

#### `login()`

Handles user login authentication. Continuously prompts for credentials until successful login.

**Parameters:**
- None

**Returns:**
- `Promise<void>`

**Side Effects:**
- Sets `loggedInUser` variable upon successful authentication
- Outputs status messages to console

**Example Flow:**
```
👤 Enter username: john
🔑 Enter password: ********
✅ Successfully logged in as john
```

---

#### `mainMenu()`

Displays and handles the main menu of the application. Provides options for storing, retrieving, and deleting passwords.

**Parameters:**
- None

**Returns:**
- `Promise<void>`

**Menu Options:**
1. Store a password
2. Retrieve a password
3. Delete a password
4. Logout & Exit

**Example Flow:**
```
📌 Menu:
1️⃣ Store a password
2️⃣ Retrieve a password
3️⃣ Delete a password
4️⃣ Logout & Exit
👉 Choose an option: 1
```

---

#### `startApp()`

Initializes and starts the application. Handles first-time user registration and login flow.

**Parameters:**
- None

**Returns:**
- `Promise<void>`

**Flow:**
1. Prompts for new user registration (optional)
2. Calls `login()` to authenticate user
3. Calls `mainMenu()` to start main application loop

---

## database.js

Database module handling MongoDB connection, user authentication, and password CRUD operations.

### Configuration

```javascript
const mongoURI = "mongodb://localhost:27017/passwordVault";
```

### Models

#### Password Schema

```javascript
{
  service: String,           // Required
  username: String,          // Required
  user: String,              // Required (vault owner)
  encryptedPassword: String, // Required
  iv: String                 // Required
}
```

**Indexes:**
- Unique compound index on `{service, username, user}` to prevent duplicates

### Functions

#### `hashPassword(password)`

Hashes a password using SHA-256.

**Parameters:**
- `password` (string): Plain text password to hash

**Returns:**
- `string`: Hexadecimal hash of the password

**Example:**
```javascript
const hashed = hashPassword("mySecretPassword");
// Returns: "a1b2c3d4e5f6..."
```

---

#### `loadUsers()`

Loads users from the local JSON file.

**Parameters:**
- None

**Returns:**
- `Array<{username: string, password: string}>`: Array of user objects

**Example:**
```javascript
const users = loadUsers();
// Returns: [{username: "john", password: "a1b2c3..."}, ...]
```

---

#### `saveUsers(users)`

Saves users array to the local JSON file.

**Parameters:**
- `users` (Array): Array of user objects to save

**Returns:**
- `void`

**Side Effects:**
- Writes to `users.json` file
- Creates file if it doesn't exist

---

#### `createUser(username, password)`

Creates a new user account.

**Parameters:**
- `username` (string): Desired username
- `password` (string): Plain text password (will be hashed)

**Returns:**
- `boolean`: `true` if user created successfully, `false` if user already exists

**Example:**
```javascript
const success = createUser("john", "myPassword123");
if (success) {
    console.log("User created!");
} else {
    console.log("User already exists!");
}
```

---

#### `authUser(username, password)`

Authenticates a user by checking credentials.

**Parameters:**
- `username` (string): Username to authenticate
- `password` (string): Plain text password to verify

**Returns:**
- `boolean`: `true` if credentials are valid, `false` otherwise

**Example:**
```javascript
const isValid = authUser("john", "myPassword123");
if (isValid) {
    console.log("Authentication successful!");
}
```

---

#### `storePassword(service, username, password, user)`

Stores or updates an encrypted password in the database.

**Parameters:**
- `service` (string): Name of the service (e.g., "Gmail")
- `username` (string): Username for the service
- `password` (string|null): Password to store (null to auto-generate)
- `user` (string): The vault owner (logged-in user)

**Returns:**
- `Promise<void>`

**Side Effects:**
- Saves encrypted password to MongoDB
- Generates password if null provided
- Updates existing entry if duplicate found

**Example:**
```javascript
await storePassword("Gmail", "john@email.com", "myGmailPass", "john");
// Output: ✅ Password saved for Gmail and john@email.com

await storePassword("Facebook", "john", null, "john");
// Output: 🔑 Generated Password: aB3$xY9#mK2@
// Output: ✅ Password saved for Facebook and john
```

---

#### `retrievePassword(service, username, user)`

Retrieves and decrypts a password from the database.

**Parameters:**
- `service` (string): Name of the service
- `username` (string): Username for the service
- `user` (string): The vault owner (logged-in user)

**Returns:**
- `Promise<string|null>`: Decrypted password or null if not found

**Example:**
```javascript
const password = await retrievePassword("Gmail", "john@email.com", "john");
// Output: 🔑 Password for Gmail: myGmailPass
// Returns: "myGmailPass"
```

---

#### `deletePassword(service, username, user)`

Deletes a password entry from the database.

**Parameters:**
- `service` (string): Name of the service
- `username` (string): Username for the service
- `user` (string): The vault owner (logged-in user)

**Returns:**
- `Promise<void>`

**Example:**
```javascript
await deletePassword("Gmail", "john@email.com", "john");
// Output: ✅ Deleted password for Gmail
```

---

## cryptoUtils.js

Cryptographic utilities for password encryption and decryption.

### Configuration

```javascript
const algorithm = "aes-256-cbc";
const secretKey = crypto.createHash('sha256')
    .update('your-secure-password-key')
    .digest();
```

### Functions

#### `encryptPassword(password)`

Encrypts a password using AES-256-CBC encryption.

**Parameters:**
- `password` (string): Plain text password to encrypt

**Returns:**
- `Object`: Object containing:
  - `encryptedPassword` (string): Encrypted password in hex format
  - `iv` (string): Initialization vector in hex format

**Algorithm:**
1. Generate random 16-byte IV
2. Create cipher with AES-256-CBC, secret key, and IV
3. Encrypt password
4. Return encrypted data and IV

**Example:**
```javascript
const { encryptedPassword, iv } = encryptPassword("myPassword123");
// Returns: {
//   encryptedPassword: "a1b2c3d4e5f6...",
//   iv: "f6e5d4c3b2a1..."
// }
```

**Security Notes:**
- Each encryption generates a unique IV
- Same password encrypted twice produces different ciphertext
- IV must be stored with encrypted password for decryption

---

#### `decryptPassword(encryptedPassword, iv)`

Decrypts an encrypted password using AES-256-CBC decryption.

**Parameters:**
- `encryptedPassword` (string): Encrypted password in hex format
- `iv` (string): Initialization vector in hex format

**Returns:**
- `string|null`: Decrypted plain text password or null if decryption fails

**Algorithm:**
1. Create decipher with AES-256-CBC, secret key, and IV
2. Decrypt password
3. Return plain text or null on error

**Example:**
```javascript
const password = decryptPassword("a1b2c3d4e5f6...", "f6e5d4c3b2a1...");
// Returns: "myPassword123"
```

**Error Handling:**
- Returns `null` if decryption fails
- Logs error message to console
- Common failures: incorrect IV, corrupted data, wrong key

---

## passwordGenerator.js

Secure password generator using cryptographic random number generation.

### Functions

#### `generatePassword(length)`

Generates a cryptographically secure random password.

**Parameters:**
- `length` (number, optional): Length of the password to generate
  - Default: 12
  - Recommended: 12-32 characters

**Returns:**
- `string`: Generated password

**Character Set:**
- Lowercase letters: a-z (26 characters)
- Uppercase letters: A-Z (26 characters)
- Digits: 0-9 (10 characters)
- Special characters: !@#$%^&*()-_=+ (14 characters)
- Total: 76 possible characters per position

**Example:**
```javascript
const password = generatePassword();
// Returns: "aB3$xY9#mK2@" (12 characters)

const longPassword = generatePassword(20);
// Returns: "aB3$xY9#mK2@pQ7&wZ4!" (20 characters)
```

**Security:**
- Uses `crypto.randomInt()` for cryptographically secure randomness
- Each character position selected independently
- Entropy: ~6.25 bits per character (log2(76))
- 12-character password: ~75 bits of entropy

---

## Error Handling

### Common Errors

#### MongoDB Connection Error
```
❌ MongoDB Connection Error: <error details>
```
**Cause:** MongoDB not running or connection refused  
**Solution:** Start MongoDB service

#### Decryption Failed
```
❌ Decryption failed: <error message>
```
**Cause:** Invalid IV, corrupted data, or wrong encryption key  
**Solution:** Verify data integrity, check encryption key

#### Error Saving Password
```
❌ Error saving password: <error details>
```
**Cause:** MongoDB connection lost or invalid data  
**Solution:** Check MongoDB status, verify data format

#### Error Retrieving Password
```
❌ Error retrieving password: <error details>
```
**Cause:** Database query failed or connection lost  
**Solution:** Check MongoDB status

#### No Password Found
```
❌ No password found.
```
**Cause:** No matching entry in database  
**Solution:** Verify service name and username are correct

---

## Data Flow

### Storing a Password

```
User Input (plain text)
    ↓
generatePassword() [if needed]
    ↓
encryptPassword()
    ↓
{encryptedPassword, iv}
    ↓
MongoDB.save()
    ↓
Database
```

### Retrieving a Password

```
User Request (service, username)
    ↓
MongoDB.findOne()
    ↓
{encryptedPassword, iv}
    ↓
decryptPassword()
    ↓
Plain Text Password
    ↓
Display to User
```

### User Authentication

```
User Input (username, password)
    ↓
hashPassword(password)
    ↓
loadUsers()
    ↓
Compare Hashes
    ↓
Authentication Result (true/false)
```

---

## Database Queries

### MongoDB Operations

#### Insert Password
```javascript
await new Password({
    service,
    username,
    user,
    encryptedPassword,
    iv
}).save();
```

#### Update Password
```javascript
const entry = await Password.findOne({ service, username, user });
entry.encryptedPassword = newEncryptedPassword;
entry.iv = newIv;
await entry.save();
```

#### Retrieve Password
```javascript
const entry = await Password.findOne({ service, username, user });
```

#### Delete Password
```javascript
await Password.findOneAndDelete({ service, username, user });
```

---

## Constants and Configuration

### File Paths
```javascript
const usersFilePath = path.join(__dirname, 'users.json');
```

### MongoDB URI
```javascript
const mongoURI = "mongodb://localhost:27017/passwordVault";
```

### Encryption Settings
```javascript
const algorithm = "aes-256-cbc";
const secretKey = crypto.createHash('sha256')
    .update('your-secure-password-key')
    .digest();
```

### Password Generation
```javascript
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
const defaultLength = 12;
```

---

## Testing

### Manual Testing Examples

#### Test User Creation
```javascript
const result = createUser("testuser", "testpass123");
console.assert(result === true, "User creation should succeed");

const duplicate = createUser("testuser", "anotherpass");
console.assert(duplicate === false, "Duplicate user should fail");
```

#### Test Password Encryption/Decryption
```javascript
const original = "mySecretPassword123!";
const { encryptedPassword, iv } = encryptPassword(original);
const decrypted = decryptPassword(encryptedPassword, iv);
console.assert(decrypted === original, "Decryption should match original");
```

#### Test Password Generation
```javascript
const pwd = generatePassword(12);
console.assert(pwd.length === 12, "Password length should be 12");
console.assert(/[a-z]/.test(pwd), "Should contain lowercase");
console.assert(/[A-Z]/.test(pwd), "Should contain uppercase");
console.assert(/[0-9]/.test(pwd), "Should contain digit");
```

---

## Version History

### v1.0.0
- Initial release
- Basic password storage and retrieval
- AES-256-CBC encryption
- Multi-user support
- Password generation

---

For security considerations and best practices, see [SECURITY.md](SECURITY.md).

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
