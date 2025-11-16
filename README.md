# E-Commerce Backend

## Overview
This is the backend for an e-commerce application, built with Node.js, Express.js, MongoDB, and MySQL. It includes authentication, product management, and order processing.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- MySQL
- JWT Authentication

## Setup Instructions
1. Clone the repository.
2. Navigate to the `Backend` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   MYSQL_HOST=127.0.0.1
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=ecommerce
   JWT_SECRET=your_jwt_secret
   ```
5. Start the server:
   ```bash
   node server.js
   ```

## Testing
1. Run the tests:
   ```bash
   npm test
   ```

## API Endpoints
### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.

### Products
- `GET /api/products`: Get all products.
- `POST /api/products`: Create a new product (admin only).

### Orders
- `POST /api/orders`: Create a new order (authenticated users only).