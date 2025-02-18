# Flight Data Logger API Documentation

This is the API documentation for the **Flight Data Logger** project. The API allows users to upload, retrieve, and analyze flight logs. It also supports user authentication and role-based access control.
### API code can be found in the [flight-data-logger](https://github.com/Dnyaneshpise/quadcopter-script/tree/main/flight-data-logger) directory
---

## Table of Contents
1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [User Endpoints](#user-endpoints)
   - [Log Endpoints](#log-endpoints)
   - [Admin Endpoints](#admin-endpoints)
4. [Error Handling](#error-handling)
5. [Examples](#examples)

---

## Base URL
The base URL for all endpoints is:
```
https://quadcopter-log-api.onrender.com/
```

---

## Authentication
All endpoints (except `/api/users/register` and `/api/users/login`) require authentication. Authentication is done using **JWT tokens** stored in cookies.

### Steps:
1. **Register** a new user using `/api/users/register`.
2. **Login** using `/api/users/login` to get a JWT token.
3. The token is automatically stored in a cookie and sent with every request.

---

## Endpoints

### User Endpoints

#### 1. Register a New User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "user" // Optional (default: "user")
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

---

#### 2. Login
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "message": "Logged in successfully"
  }
  ```
- **Note**: The server sets a `token` cookie upon successful login.

---

#### 3. Logout
- **URL**: `/api/users/logout`
- **Method**: `POST`
- **Success Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **Note**: The server clears the `token` cookie.

---

### Log Endpoints

#### 1. Upload a Log File
- **URL**: `/api/logs/upload`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: multipart/form-data`
- **Request Body**:
  - `file`: (File) Upload a `.bin` log file.
  - `metadata`: (JSON) Optional metadata (e.g., `{"flightNumber": "ABC123"}`).
- **Success Response**:
  ```json
  {
    "message": "Log uploaded successfully",
    "log": {
      "_id": "67af804cb0b2dca3e9f19274",
      "user": "67af7deeb65adf7cc969b0ee",
      "file": "https://res.cloudinary.com/.../flight-log.bin",
      "metadata": { "flightNumber": "ABC123" },
      "date": "2025-02-14T17:41:32.453Z"
    }
  }
  ```

---

#### 2. Retrieve All Logs
- **URL**: `/api/logs`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "logs": [
      {
        "_id": "67af804cb0b2dca3e9f19274",
        "user": "67af7deeb65adf7cc969b0ee",
        "file": "https://res.cloudinary.com/.../flight-log.bin",
        "metadata": { "flightNumber": "ABC123" },
        "date": "2025-02-14T17:41:32.453Z"
      }
    ]
  }
  ```

---

#### 3. Retrieve Log by ID
- **URL**: `/api/logs/:id`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "log": {
      "_id": "67af804cb0b2dca3e9f19274",
      "user": "67af7deeb65adf7cc969b0ee",
      "file": "https://res.cloudinary.com/.../flight-log.bin",
      "metadata": { "flightNumber": "ABC123" },
      "date": "2025-02-14T17:41:32.453Z"
    }
  }
  ```

---

#### 4. Retrieve Logs by Date
- **URL**: `/api/logs/date/:date`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: `1`).
  - `limit`: Logs per page (default: `10`).
- **Success Response**:
  ```json
  {
    "logs": [
      {
        "_id": "67af804cb0b2dca3e9f19274",
        "user": "67af7deeb65adf7cc969b0ee",
        "file": "https://res.cloudinary.com/.../flight-log.bin",
        "metadata": { "flightNumber": "ABC123" },
        "date": "2023-10-15T12:34:56.789Z"
      }
    ],
    "totalPages": 2,
    "currentPage": 1,
    "totalLogs": 10
  }
  ```

---

#### 5. Export Log in Specific Format
- **URL**: `/api/logs/:id/export?format=<format>`
- **Method**: `GET`
- **Query Parameters**:
  - `format`: Export format (`csv` or `json`, default: `csv`).
- **Success Response**:
  - **CSV**:
    ```
    _id,user,file,date,metadata.flightNumber
    67af804cb0b2dca3e9f19274,67af7deeb65adf7cc969b0ee,https://res.cloudinary.com/.../flight-log.bin,2025-02-14T17:41:32.453Z,ABC123
    ```
  - **JSON**:
    ```json
    {
      "_id": "67af804cb0b2dca3e9f19274",
      "user": "67af7deeb65adf7cc969b0ee",
      "file": "https://res.cloudinary.com/.../flight-log.bin",
      "metadata": { "flightNumber": "ABC123" },
      "date": "2025-02-14T17:41:32.453Z"
    }
    ```

---

#### 6. Analyze Log (Admin Only)
- **URL**: `/api/logs/:id/analyze`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "analysis": {
      "duration": "2 hours",
      "maxAltitude": "1500 meters",
      "flightPath": "GPS coordinates here",
      "anomalies": "No anomalies detected"
    }
  }
  ```

---

### Admin Endpoints

#### 1. Get All Users (Admin Only)
- **URL**: `/api/users`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "users": [
      {
        "_id": "67af7deeb65adf7cc969b0ee",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "user"
      }
    ]
  }
  ```

---

#### 2. Get Admin Dashboard (Admin Only)
- **URL**: `/api/admin`
- **Method**: `GET`
- **Success Response**:
  ```json
  {
    "stats": {
      "totalUsers": 10,
      "totalLogs": 50,
      "recentLogs": [
        {
          "_id": "67af804cb0b2dca3e9f19274",
          "user": "67af7deeb65adf7cc969b0ee",
          "file": "https://res.cloudinary.com/.../flight-log.bin",
          "metadata": { "flightNumber": "ABC123" },
          "date": "2025-02-14T17:41:32.453Z"
        }
      ]
    }
  }
  ```

---

## Error Handling
- **400 Bad Request**: Invalid input (e.g., invalid date format).
- **401 Unauthorized**: Missing or invalid token.
- **403 Forbidden**: Insufficient permissions (e.g., non-admin accessing admin endpoints).
- **404 Not Found**: Resource not found (e.g., log not found).
- **500 Internal Server Error**: Server-side error.

---

## Examples

### 1. Register a User
```bash
POST /api/users/register
Body:
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /api/users/login
Body:
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 3. Upload a Log
```bash
POST /api/logs/upload
Body: Form-data with `file` and optional `metadata`.
```

### 4. Retrieve Logs by Date
```bash
GET /api/logs/date/2023-10-15?page=1&limit=5
```

### 5. Analyze Log
```bash
GET /api/logs/67af804cb0b2dca3e9f19274/analyze
```

---

## Live Deployment
The API is live at:  
**`https://quadcopter-log-api.onrender.com`**
