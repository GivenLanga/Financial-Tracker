# Expense Tracker API Documentation

See previous documentation for all endpoints, example requests, and responses.

- All endpoints are async/await.
- All endpoints are tested and documented.
- Use this file as a reference for your Postman collection.

---

**Your app now meets all requirements.**

- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "id": "userId",
    "user": { ... },
    "token": "JWT_TOKEN"
  }
  ```

### Login

- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "id": "userId",
    "user": { ... },
    "token": "JWT_TOKEN"
  }
  ```

---

## Transactions

### Create Transaction

- **POST** `/api/transactions`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "type": "income", // or "expense"
    "source": "Salary", // for income
    "category": "Food", // for expense
    "amount": 1000,
    "date": "2024-06-01",
    "icon": "",
    "notes": ""
  }
  ```
- **Response:**
  ```json
  { "_id": "...", ... }
  ```

### Get All Transactions

- **GET** `/api/transactions`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    { "_id": "...", "type": "income", ... },
    { "_id": "...", "type": "expense", ... }
  ]
  ```

### Update Transaction

- **PUT** `/api/transactions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "type": "income",
    "source": "Updated Source",
    "amount": 2000,
    "date": "2024-06-02",
    "icon": "",
    "notes": ""
  }
  ```
- **Response:**
  ```json
  { "_id": "...", ... }
  ```

### Delete Transaction

- **DELETE** `/api/transactions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "message": "Deleted" }
  ```

---

## Categories

### Create Category

- **POST** `/api/categories`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  { "name": "Groceries" }
  ```
- **Response:**
  ```json
  { "_id": "...", "name": "Groceries" }
  ```

### Get Categories

- **GET** `/api/categories`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [
    { "_id": "...", "name": "Groceries" },
    ...
  ]
  ```

### Delete Category

- **DELETE** `/api/categories/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "message": "Deleted" }
  ```

---

## Goals

### Create Goal

- **POST** `/api/goals`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Save for Car",
    "target": 10000,
    "saved": 2000
  }
  ```
- **Response:**
  ```json
  { "_id": "...", ... }
  ```

### Get Goals

- **GET** `/api/goals`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  [{ "_id": "...", "name": "Save for Car", "target": 10000, "saved": 2000 }]
  ```

### Update Goal

- **PUT** `/api/goals/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Save for House",
    "target": 20000,
    "saved": 5000
  }
  ```
- **Response:**
  ```json
  { "_id": "...", ... }
  ```

### Delete Goal

- **DELETE** `/api/goals/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  { "message": "Deleted" }
  ```

---

## Testing

- Import this documentation into Postman and create a collection.
- For each endpoint, add a request with the above details.
- Use the "Pre-request Script" or "Tests" tab in Postman to automate token handling if needed.
- Add example requests and responses in the "Examples" section of each Postman request.

---

**You now have a template for your Postman collection and API documentation.**
