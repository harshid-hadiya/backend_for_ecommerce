# Testing Instructions

## Overview
This document provides instructions to test the backend application, including the payloads for various API endpoints.

## Prerequisites
- Ensure the server is running on `http://localhost:5000`.
- Use a tool like Postman or cURL to test the endpoints.

---

## Authentication Endpoints

### 1. Register a New User
**Endpoint:** `POST /api/auth/register`

**Payload:**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### 2. Login a User
**Endpoint:** `POST /api/auth/login`

**Payload:**
```json
{
  "email": "testuser@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>"
}
```

---

## Product Endpoints

### 3. Get All Products
**Endpoint:** `GET /api/products`

**Headers:**
- None

**Expected Response:**
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

### 4. Create a New Product (Admin Only)
**Endpoint:** `POST /api/products`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Payload:**
```json
{
  "sku": "P002",
  "name": "Product 2",
  "price": 200,
  "category": "Category 2"
}
```

**Expected Response:**
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

### 5. Create a New Order
**Endpoint:** `POST /api/orders`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Payload:**
```json
{
  "userId": 1,
  "total": 300,
  "items": [
    {
      "productId": "1",
      "quantity": 2,
      "priceAtPurchase": 100
    },
    {
      "productId": "2",
      "quantity": 1,
      "priceAtPurchase": 200
    }
  ]
}
```

**Expected Response:**
```json
{
  "message": "Order created successfully",
  "orderId": 1
}
```

### 6. Get Orders by Date
**Endpoint:** `GET /api/orders/:userId?date=YYYY-MM-DD`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Example Request:**
```
GET /api/orders/1?date=2025-11-16
```

**Expected Response:**
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

## Notes
- Replace `<JWT_TOKEN>` with the token received from the login endpoint.
- Ensure the database is seeded with initial data for testing.
- Use the `isAdmin` middleware to restrict access to admin-only routes.