# Agent Guidelines for C0PYC4T10

## Project Overview

This is a Node.js project using CommonJS modules (`.js` files with `require()`). It includes AI integration via OpenAI SDK and basic file operations.

## Development Commands

### Running the Application
```bash
node app.js              # Run the OpenAI connection test
node file_action.js      # Run the file creation example
node index.js            # Run the circle/function example
npm start                # Run server.js (if exists)
```

### Testing
```bash
npm test                 # Currently echoes "Error: no test specified"
```

Note: No test framework is configured. To add testing, consider installing Jest or Mocha.

### Dependency Management
```bash
npm install              # Install dependencies from package.json
npm install <package>    # Add a new dependency
npm install --save-dev <package>  # Add a dev dependency
```

### Environment Variables
- Copy `.env.example` to `.env` and configure required variables
- Required: `OPENROUTER_API_KEY` (for app.js)
- Never commit `.env` files containing secrets

## Code Style Guidelines

### General Conventions
- Use **2-space indentation** for consistency
- Use **semicolons** at the end of statements
- Use **camelCase** for variable and function names
- Use **PascalCase** for constructor functions and classes
- Use **UPPER_SNAKE_CASE** for constants
- Maximum line length: 100 characters

### File Structure
```
/home/skarbolt/Documents/C0PYC4T10/
├── app.js              # OpenAI connection test
├── file_action.js      # File system operations example
├── index.js            # JavaScript basics demo
├── index.html          # Simple HTML page
├── package.json        # Project configuration
└── .env                # Environment variables (do not commit)
```

### JavaScript Patterns

#### Async/Await (Preferred)
```javascript
async function example() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
```

#### Error Handling
- Always wrap async operations in try/catch blocks
- Log errors with `console.error()` and include `error.message`
- Re-throw errors when appropriate to let callers handle them

#### Imports (CommonJS)
```javascript
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `filePath`, `apiKey` |
| Functions | camelCase | `createFile()`, `testConnection()` |
| Classes/Constructors | PascalCase | `Circle`, `Animal` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Private members | Prefix with underscore | `_privateMethod()` |

### JavaScript Best Practices

1. **Use const by default**, var only when reassignment is needed
2. **Prefer arrow functions** for callbacks: `arr.map(x => x * 2)`
3. **Use template literals** for string interpolation: `` `Hello ${name}` ``
4. **Destructure objects** when accessing multiple properties:
   ```javascript
   const { name, age } = person;
   ```
5. **Avoid side effects** in functions when possible
6. **Use meaningful variable names** - avoid single letters except in loops

### Async Patterns
```javascript
// Good: proper async/await with error handling
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error.message);
    throw error;
  }
}

// Avoid: raw .then() chains without error handling
```

### File Operations
```javascript
const fs = require('fs').promises;
const path = require('path');

async function safeFileOperation(filePath) {
  try {
    await fs.writeFile(filePath, 'content');
    console.log('File written successfully');
  } catch (error) {
    console.error('File operation failed:', error.message);
  }
}
```

## Adding New Files

1. Place in appropriate directory based on functionality
2. Use `.js` extension for CommonJS modules
3. Add `const fs = require('fs').promises;` for async file operations
4. Export functions using `module.exports = { ... }` or `exports.fn = fn`

## Common Issues to Avoid

- **Don't use ES modules** (`import`/`export`) - project uses CommonJS
- **Don't forget to handle Promise rejections** - always use try/catch with await
- **Don't expose API keys** - use environment variables via dotenv
- **Don't leave console.log statements** in production code (use appropriate logging)
- **Don't ignore linting warnings** if a linter is added later

## Adding a Linter

To improve code quality, consider adding ESLint:

```bash
npm install --save-dev eslint
npx eslint --init
```

Recommended ESLint config for this project:
- env: node, es2021
- extends: eslint:recommended
- rules: semi: ["error", "always"], quotes: ["error", "single"]
