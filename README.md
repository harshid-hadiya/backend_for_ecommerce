# E-Commerce Backend

## Admin Login Credentials
```
Email: testuser@example.com
Password: password123
```
## 1. Overview
This is the backend for an e-commerce application built using **Node.js**, **Express.js**, **MongoDB**, and **MySQL**. It provides authentication, product management, and order processing. The project is designed in a simple, student-friendly manner for clarity and evaluation.

### Key Features
- User registration & login using JWT
- Admin-only product creation
- Order placement with multiple items
- MySQL + MongoDB hybrid usage
- Secure route protection using middleware

---

## 2. Tech Stack & Dependencies
### Backend
- **Node.js** (Runtime)
- **Express.js** (Server framework)
- **MongoDB** (Product storage)
- **MySQL** (User & Order data)
- **JWT Authentication** (Secure login)

### Main Dependencies
- express
- mongoose
- mysql2
- jsonwebtoken
- bcryptjs
- dotenv
- cors

---

## 3. Setup Instructions
1. Clone the repository.
2. Navigate to the `Backend` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_string
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

---

## 4. Database Configuration
### MongoDB
- Used for storing products.
- No migration needed; Mongoose handles schema.

### MySQL
Required tables:
- **users** (id, name, email, password, role)
- **orders** (id, userId, total, createdAt)
- **order_items** (id, orderId, productId, quantity, priceAtPurchase)

Run migrations manually using MySQL client or phpMyAdmin.

---

## 5. Testing Instructions
### Prerequisites
- Server must run on `http://localhost:5000`
- Use **Postman** or **cURL** for testing

---

## Authentication Endpoints
### 1. Register User
**POST** `/api/auth/register`
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "customer"
}
```
Expected:
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### 2. Login User
**POST** `/api/auth/login`
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```
Expected:
```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}
```

---

## Product Endpoints
### 3. Get All Products
**GET** `/api/products`
Expected:
```json
[
  {
    "id": "1",
    "sku": "P001",
    "name": "Product 1",
    "price": 100,
    "category": "Category 1",
    "updatedAt": "2025-11-16T00:00:00.000Z"
  }
]
```

### 4. Create Product (Admin Only)
**POST** `/api/products`
Headers: `Authorization: Bearer <JWT_TOKEN>`
```json
{
  "sku": "P002",
  "name": "Product 2",
  "price": 200,
  "category": "Category 2"
}
```
Expected:
```json
{
  "id": "2",
  "sku": "P002",
  "name": "Product 2",
  "price": 200,
  "category": "Category 2",
  "updatedAt": "2025-11-16T00:00:00.000Z"
}
```

---

## Order Endpoints
### 5. Create Order
**POST** `/api/orders`
Headers: `Authorization: Bearer <JWT_TOKEN>`
```json
{
  "userId": 1,
  "total": 300,
  "items": [
    { "productId": "1", "quantity": 2, "priceAtPurchase": 100 },
    { "productId": "2", "quantity": 1, "priceAtPurchase": 200 }
  ]
}
```
Expected:
```json
{
  "message": "Order created successfully",
  "orderId": 1
}
```

### 6. Get Orders by Date
**GET** `/api/orders/:userId?date=YYYY-MM-DD`
Example:
```
/api/orders/1?date=2025-11-16
```
Expected:
```json
[
  {
    "orderId": 1,
    "total": 300,
    "createdAt": "2025-11-16T10:00:00.000Z",
    "productId": "1",
    "quantity": 2,
    "priceAtPurchase": 100
  },
  {
    "orderId": 1,
    "total": 300,
    "createdAt": "2025-11-16T10:00:00.000Z",
    "productId": "2",
    "quantity": 1,
    "priceAtPurchase": 200
  }
]
```

---


## Deployment
- Backend URL: (https://backend-for-ecommerce-1.onrender.com)
- Frontend URL: (https://frontend-for-ecommerce-b7v7.onrender.com/products)

---
