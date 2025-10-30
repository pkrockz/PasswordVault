# Security Policy

## Overview

PasswordVault is designed with security in mind, implementing industry-standard encryption and authentication mechanisms. This document outlines the security features, best practices, and guidelines for using PasswordVault securely.

## Security Features

### 1. Password Encryption
- **Algorithm**: AES-256-CBC (Advanced Encryption Standard with 256-bit key in Cipher Block Chaining mode)
- **Key Size**: 256 bits (32 bytes)
- **IV (Initialization Vector)**: Unique 16-byte IV generated for each password
- **Storage**: Encrypted passwords stored in MongoDB with their corresponding IV

### 2. User Authentication
- **Password Hashing**: SHA-256 hash function for user credentials
- **Storage**: Hashed passwords stored locally in `users.json`
- **Session**: Single-user session per application instance

### 3. Password Generation
- **Randomness**: Cryptographically secure random number generation using `crypto.randomInt()`
- **Character Set**: Includes:
  - Lowercase letters (a-z)
  - Uppercase letters (A-Z)
  - Digits (0-9)
  - Special characters (!@#$%^&*()-_=+)
- **Default Length**: 12 characters (configurable)

## Security Best Practices

### For Users

#### 1. Encryption Key Management
**⚠️ CRITICAL**: Before using PasswordVault in a production environment, you MUST change the default encryption key:

**File**: `cryptoUtils.js`
```javascript
const secretKey = crypto.createHash('sha256').update('your-secure-password-key').digest();
```

**How to change it securely**:
1. Generate a strong, random passphrase (at least 32 characters)
2. Use a password manager or secure random generator
3. Never commit this key to version control
4. Consider using environment variables:

```javascript
const secretKey = crypto.createHash('sha256')
  .update(process.env.VAULT_SECRET_KEY || 'your-secure-password-key')
  .digest();
```

#### 2. Master Password
- Choose a strong, unique master password for your user account
- Use at least 12 characters with mixed case, numbers, and symbols
- Never share your master password
- Don't use the same password for other services

#### 3. System Security
- Keep your operating system and Node.js up to date
- Use full disk encryption on your device
- Ensure physical security of the machine running PasswordVault
- Lock your screen when away from your computer

#### 4. MongoDB Security
- Run MongoDB with authentication enabled
- Use a strong password for MongoDB admin user
- Bind MongoDB to localhost only (don't expose to network)
- Enable encryption at rest for MongoDB data files
- Regularly backup your MongoDB database

#### 5. File Permissions
Ensure proper permissions on sensitive files:
```bash
chmod 600 users.json  # Only owner can read/write
chmod 700 .           # Only owner can access directory
```

### For Developers

#### 1. Secure Development Practices
- Never hardcode secrets or encryption keys
- Use environment variables for configuration
- Implement proper error handling without exposing sensitive data
- Regularly update dependencies for security patches

#### 2. Code Review
- Review all cryptographic implementations
- Audit password storage and retrieval functions
- Check for potential information leaks in error messages
- Validate input to prevent injection attacks

#### 3. Testing
- Never use production data in testing
- Don't commit test credentials to version control
- Clear test data after testing

## Known Limitations

### Current Implementation
This is an educational/learning project with the following limitations:

1. **Single-user local authentication**: Not suitable for multi-user environments
2. **Local key storage**: Encryption key stored in source code by default
3. **No key derivation function**: Could benefit from PBKDF2 or Argon2
4. **No rate limiting**: Vulnerable to brute force attacks on local machine
5. **No audit logging**: No record of password access or modifications
6. **No backup/recovery**: No built-in backup or master password recovery

### Production Considerations

For production use, consider implementing:

1. **Key Derivation**: Use PBKDF2, bcrypt, or Argon2 for password hashing
2. **Environment Variables**: Store sensitive configuration externally
3. **Master Password**: Derive encryption key from master password
4. **Two-Factor Authentication**: Add additional authentication layer
5. **Audit Logging**: Track all password access and modifications
6. **Backup Strategy**: Implement secure backup and recovery procedures
7. **Rate Limiting**: Limit authentication attempts
8. **Session Timeout**: Auto-logout after inactivity
9. **Secure Communication**: If networked, use TLS/SSL
10. **Password Strength Validation**: Enforce strong password policies

## Reporting Security Vulnerabilities

If you discover a security vulnerability in PasswordVault, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email the maintainer directly with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Allow reasonable time for a fix before public disclosure

## Encryption Details

### AES-256-CBC Encryption Process

```
1. Generate random 16-byte IV
2. Create cipher with algorithm, secret key, and IV
3. Encrypt password: cipher.update(password) + cipher.final()
4. Store: {encryptedPassword, iv}
```

### AES-256-CBC Decryption Process

```
1. Retrieve encrypted password and IV from database
2. Create decipher with algorithm, secret key, and IV
3. Decrypt: decipher.update(encryptedPassword) + decipher.final()
4. Return plain text password
```

### Why AES-256-CBC?

- **AES-256**: Widely trusted, NIST-approved encryption standard
- **256-bit key**: Provides strong security margin
- **CBC mode**: Each block depends on previous blocks, enhancing security
- **Unique IV**: Ensures same password encrypted twice produces different ciphertext

## Data Storage

### What's Stored Where

| Data | Location | Format | Security |
|------|----------|--------|----------|
| User credentials | `users.json` | SHA-256 hashed | Local file system |
| Encrypted passwords | MongoDB | AES-256-CBC encrypted | Database encryption |
| Service names | MongoDB | Plain text | Database access control |
| Usernames | MongoDB | Plain text | Database access control |
| IVs | MongoDB | Hex string | Required for decryption |

### Database Schema

```javascript
{
  service: "Gmail",           // Plain text
  username: "user@email.com", // Plain text
  user: "john",               // Plain text (vault owner)
  encryptedPassword: "a1b2c3...", // AES-256-CBC encrypted
  iv: "d4e5f6..."             // Initialization vector (hex)
}
```

## Compliance Considerations

### GDPR and Privacy
- PasswordVault stores data locally and in local MongoDB
- Users have complete control over their data
- No data transmitted to external services
- Users can delete all data at any time

### Data Retention
- Passwords remain until explicitly deleted by user
- User accounts remain in `users.json` until manually removed
- MongoDB data persists until manually deleted

## Security Checklist

Before deploying PasswordVault:

- [ ] Changed default encryption key in `cryptoUtils.js`
- [ ] Set up environment variables for sensitive configuration
- [ ] Enabled MongoDB authentication
- [ ] Configured MongoDB to listen on localhost only
- [ ] Set appropriate file permissions (600 for users.json)
- [ ] Enabled disk encryption on host system
- [ ] Implemented backup strategy
- [ ] Updated all dependencies to latest versions
- [ ] Reviewed and understood all security limitations
- [ ] Implemented additional security measures as needed

## Additional Resources

- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [AES Encryption Standard](https://csrc.nist.gov/publications/detail/fips/197/final)

---

**Remember**: Security is a process, not a product. Regularly review and update your security practices.
