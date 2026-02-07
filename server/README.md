# Civic Complaint System API Server

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Running the Server

- **Development Mode:**
  ```bash
  npm run dev
  ```
  Runs with `nodemon` for hot-reloading.

- **Production Mode:**
  ```bash
  npm start
  ```

## API Routes

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Complaints
- `POST /api/complaints` - Create a complaint (Protected)

## Verification
Run the verification script to test the server:
```bash
node verify_server.js
```
