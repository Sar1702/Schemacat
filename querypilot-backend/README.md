# SchemaCat Backend

A production-ready MongoDB developer tool backend built with the **MEN stack** (MongoDB, Express, Node.js).

## Project Overview

SchemaCat is a backend API that allows developers to:
- Register and authenticate using JWT
- Securely connect their own MongoDB databases
- Extract real-time database schema (collections, fields, indexes)
- Access a chat endpoint for future AI integration

**Important:** This version does **NOT** include LLM/AI logic. The chat endpoint is a placeholder for future integration.

## Features

- ✅ **JWT Authentication** - Secure user registration and login
- ✅ **MongoDB Connection Management** - Test and store user database connections
- ✅ **Encrypted Storage** - MongoDB URIs encrypted with AES-256
- ✅ **Schema Extraction** - Real-time extraction of collections, fields, and indexes
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Security Headers** - Helmet, CORS, input validation
- ✅ **Error Handling** - Centralized error management
- ✅ **Production-Ready** - Graceful shutdown, logging, proper structure

## Technology Stack

- **Node.js** 18+
- **Express** - Web framework
- **MongoDB** - Database (official Node.js driver)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Joi** - Request validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logging

## Folder Structure

```
schemacat-backend/
├── src/
│   ├── config/
│   │   ├── env.js              # Environment configuration
│   │   ├── cors.js             # CORS configuration
│   │   └── rateLimit.js        # Rate limiting rules
│   ├── routes/
│   │   ├── index.js            # Main router
│   │   ├── auth.routes.js      # Authentication routes
│   │   ├── db.routes.js        # Database routes
│   │   └── chat.routes.js      # Chat routes
│   ├── controllers/
│   │   ├── auth.controller.js  # Auth logic
│   │   ├── db.controller.js    # Database logic
│   │   └── chat.controller.js  # Chat logic
│   ├── services/
│   │   ├── auth.service.js           # Authentication service
│   │   ├── mongoUserDb.service.js    # User DB connection service
│   │   └── schema.service.js         # Schema extraction service
│   ├── middlewares/
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── validate.middleware.js    # Request validation
│   │   └── error.middleware.js       # Error handling
│   ├── models/
│   │   └── user.model.js       # User collection helpers
│   ├── utils/
│   │   ├── logger.js           # Logging utility
│   │   ├── crypto.js           # Encryption/decryption
│   │   ├── asyncHandler.js     # Async error wrapper
│   │   └── apiError.js         # Custom error class
│   ├── validations/
│   │   ├── auth.validation.js  # Auth schemas
│   │   ├── db.validation.js    # Database schemas
│   │   └── chat.validation.js  # Chat schemas
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- MongoDB running locally or MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone or create the backend directory**

```bash
cd schemacat-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Configure environment variables**

Edit `.env` file:

```env
NODE_ENV=development
PORT=5000

# MongoDB Core Database (for user accounts)
MONGODB_CORE_URI=mongodb://localhost:27017/schemacat_core

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Encryption Key (must be 32 characters for AES-256)
ENCRYPTION_KEY=12345678901234567890123456789012

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_CORE_URI` | MongoDB URI for user accounts | `mongodb://localhost:27017/schemacat_core` |
| `JWT_SECRET` | Secret key for JWT signing | Change in production |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `ENCRYPTION_KEY` | 32-character key for AES-256 encryption | Change in production |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Health Check

```bash
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "SchemaCat API is running",
  "timestamp": "2026-01-20T12:00:00.000Z"
}
```

### Authentication

#### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User

```bash
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "mongoUri": "***configured***",
      "dbName": "mydb"
    }
  }
}
```

### Database Connection

#### Connect MongoDB Database

```bash
POST /api/db/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "mongoUri": "mongodb+srv://user:pass@cluster.mongodb.net/",
  "dbName": "mydb"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Database connected successfully",
  "data": {
    "success": true,
    "message": "Connection successful",
    "dbName": "mydb",
    "collectionsCount": 5
  }
}
```

#### Get Database Schema

```bash
GET /api/db/schema
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "database": "mydb",
    "collections": [
      {
        "name": "users",
        "count": 150,
        "size": 45678,
        "fields": {
          "_id": "ObjectId",
          "name": "string",
          "email": "string",
          "createdAt": "Date"
        },
        "indexes": [
          {
            "name": "_id_",
            "keys": { "_id": 1 },
            "unique": false
          },
          {
            "name": "email_1",
            "keys": { "email": 1 },
            "unique": true
          }
        ]
      }
    ]
  }
}
```

### Chat (Placeholder)

#### Send Chat Message

```bash
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Show me all users created today",
  "collectionName": "users"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "receivedMessage": "Show me all users created today",
    "collectionContext": "users",
    "schemaContext": "Database: mydb\n\nCollections:\n\n- users (150 documents)\n  Fields: _id, name, email, createdAt\n  Indexes: email",
    "aiResponse": "AI integration not yet implemented. This is a placeholder response.",
    "note": "Future AI integration will generate MongoDB queries based on your natural language input and the extracted schema."
  }
}
```

## cURL Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get User Profile

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Connect Database

```bash
curl -X POST http://localhost:5000/api/db/connect \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mongoUri":"mongodb://localhost:27017","dbName":"testdb"}'
```

### Get Schema

```bash
curl -X GET http://localhost:5000/api/db/schema \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send Chat Message

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Show me all collections"}'
```

## Security Considerations

### ⚠️ Important Security Notes

1. **Read-Only MongoDB User**: When users connect their MongoDB databases to SchemaCat, they should use **read-only credentials**. This prevents accidental data modification.

   Example MongoDB user creation:
   ```javascript
   db.createUser({
     user: "schemacat_readonly",
     pwd: "secure_password",
     roles: [{ role: "read", db: "your_database" }]
   })
   ```

2. **Never Log MongoDB URIs**: The codebase ensures MongoDB connection strings are never logged. All URIs are encrypted before storage using AES-256 encryption.

3. **Change Default Secrets**: In production, always change:
   - `JWT_SECRET` - Use a strong random string
   - `ENCRYPTION_KEY` - Must be exactly 32 characters

4. **Use HTTPS**: In production, always use HTTPS to protect JWT tokens in transit.

5. **Rate Limiting**: The API includes rate limiting on authentication endpoints (5 attempts per 15 minutes) and chat endpoints (10 requests per minute).

## Database Schema

### Core Database: `schemacat_core`

**Collection: `users`**

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  name: String,
  mongoUri: String (AES-256 encrypted, optional),
  dbName: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `createdAt`

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Adding New Routes

1. Create validation schema in `src/validations/`
2. Create controller in `src/controllers/`
3. Create route in `src/routes/`
4. Import route in `src/routes/index.js`

### Testing

Use tools like:
- **Postman** - API testing GUI
- **cURL** - Command-line testing
- **Thunder Client** - VS Code extension

## Troubleshooting

### Connection Refused

**Error:** `ECONNREFUSED`

**Solution:** Ensure MongoDB is running:
```bash
# Check MongoDB status
mongod --version

# Start MongoDB (if using local installation)
mongod
```

### JWT Token Invalid

**Error:** `Not authorized, token invalid or expired`

**Solution:** 
- Check token is included in `Authorization: Bearer <token>` header
- Verify JWT_SECRET matches between registration and verification
- Token may have expired (default 7 days)

### Database Already Exists

**Error:** `User with this email already exists`

**Solution:** Use a different email or delete the existing user from the database.

## Production Deployment

### Recommended Platforms

- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS EC2**

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Use secure `ENCRYPTION_KEY` (32 chars)
- [ ] Configure `MONGODB_CORE_URI` with MongoDB Atlas
- [ ] Set proper `CORS_ORIGIN` for your frontend
- [ ] Enable HTTPS
- [ ] Configure environment variables on hosting platform
- [ ] Test all endpoints after deployment

## Future Enhancements

- [ ] LLM integration for intelligent query generation
- [ ] Query history tracking
- [ ] Multi-database support per user
- [ ] Refresh tokens
- [ ] Email verification
- [ ] Password reset
- [ ] Query execution (with safety checks)
- [ ] WebSocket support for real-time updates

## License

MIT

## Support

For issues or questions, please open an issue on the project repository.

---

**Built with ❤️ for the MongoDB developer community**
