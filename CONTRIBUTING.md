# Contributing to PasswordVault

Thank you for your interest in contributing to PasswordVault! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on what's best for the community
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/PasswordVault.git
   cd PasswordVault
   ```
3. **Set up the development environment** (see [Development Setup](#development-setup))
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues found in the code
- **New features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Code quality**: Refactoring, optimization, or cleanup
- **Security**: Address security vulnerabilities
- **UI/UX**: Improve user interface and experience

### Before You Start

1. **Check existing issues** to see if someone is already working on it
2. **Create an issue** to discuss major changes before implementing
3. **Review the documentation** to understand the project structure
4. **Read the security policy** in SECURITY.md for security-related contributions

## Development Setup

### Prerequisites

- Node.js v12.0.0 or higher
- MongoDB v4.0 or higher
- npm (comes with Node.js)
- Git

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB:
   ```bash
   # Linux/macOS
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. Run the application:
   ```bash
   node app.js
   ```

### Project Structure

```
PasswordVault/
├── app.js                  # Main application entry point
├── database.js             # Database operations
├── cryptoUtils.js          # Encryption utilities
├── passwordGenerator.js    # Password generation
├── users.json              # User credentials (auto-generated)
├── package.json            # Project metadata and dependencies
├── README.md              # Project documentation
├── SECURITY.md            # Security guidelines
└── CONTRIBUTING.md        # This file
```

## Coding Standards

### JavaScript Style Guide

Follow these guidelines to maintain code consistency:

1. **Indentation**: Use 4 spaces (not tabs)
2. **Semicolons**: Always use semicolons
3. **Quotes**: Use double quotes for strings
4. **Naming**:
   - `camelCase` for variables and functions
   - `PascalCase` for classes and models
   - `UPPER_SNAKE_CASE` for constants
5. **Comments**: Use JSDoc format for function documentation

### JSDoc Example

```javascript
/**
 * Encrypts a password using AES-256-CBC encryption
 * @param {string} password - Plain text password to encrypt
 * @returns {{encryptedPassword: string, iv: string}} Encrypted data
 */
const encryptPassword = (password) => {
    // Implementation
};
```

### Code Quality

- Write clear, self-documenting code
- Keep functions small and focused
- Avoid deep nesting (max 3 levels)
- Handle errors appropriately
- Don't log sensitive information

### Security Guidelines

- Never hardcode secrets or API keys
- Always validate and sanitize user input
- Use prepared statements for database queries
- Follow the principle of least privilege
- Document security considerations in code

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages following this format:

```
<type>: <short description>

<optional detailed description>

<optional footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: Add password strength validation

Implement a password strength checker that validates:
- Minimum length of 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

Closes #123
```

```bash
fix: Prevent duplicate password entries

Fix bug where duplicate passwords could be created for the
same service and username combination.

Fixes #456
```

```bash
docs: Update README with installation instructions

- Add detailed installation steps
- Include troubleshooting section
- Add usage examples
```

## Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Add comments** to explain complex logic
4. **Run the application** to ensure it works
5. **Check for console errors or warnings**

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Reference to related issues (e.g., "Fixes #123")
   - Screenshots (if UI changes)

3. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Code refactoring
   
   ## Testing
   How have you tested this?
   
   ## Related Issues
   Closes #(issue number)
   
   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Documentation updated
   - [ ] Changes tested locally
   - [ ] No new warnings or errors
   ```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in the project

### After Your PR is Merged

1. Delete your feature branch
2. Pull the latest changes from main:
   ```bash
   git checkout main
   git pull upstream main
   ```

## Reporting Bugs

### Before Reporting

1. **Check existing issues** to avoid duplicates
2. **Verify the bug** on the latest version
3. **Gather information** about your environment

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Enter '...'
4. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment:**
- OS: [e.g., Ubuntu 20.04]
- Node.js version: [e.g., 14.17.0]
- MongoDB version: [e.g., 4.4]

**Error messages or logs**
```
Paste any relevant error messages or logs here
```

**Additional context**
Any other context about the problem.
```

## Suggesting Enhancements

### Enhancement Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples about the feature request.
```

## Development Tips

### Debugging

- Use `console.log()` for simple debugging
- Use Node.js debugger for complex issues:
  ```bash
  node inspect app.js
  ```

### Testing Changes

1. Test normal operation flow
2. Test edge cases
3. Test error handling
4. Test with different inputs
5. Verify MongoDB data integrity

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

**Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Permission Errors**
```bash
# Fix file permissions
chmod 600 users.json
```

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with the `question` label
4. Be patient and respectful when asking for help

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project README (for significant contributions)
- Release notes (for featured changes)

## License

By contributing to PasswordVault, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to PasswordVault!** 🎉

Your contributions help make this project better for everyone.
