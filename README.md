# Authentication & Product CRUD

A full-stack project made for the Sheryians Coding School assignment.

The project has JWT authentication and a Product CRUD API, along with a React frontend to use the APIs.

## Tech Used

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* express-validator

**Frontend**

* React
* Vite
* React Router
* Axios

## Features

### Authentication

* Register
* Login
* JWT access token
* Refresh token
* Logout
* Get current user
* Protected routes

### Products

* Get all products
* Get product by ID
* Create product
* Update product
* Delete product
* Validation for product fields

Create, update and delete operations require authentication.

## Project Structure

```text
AuthenticationProductCrud/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
│
├── .gitignore
└── README.md
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Start the server:

```bash
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the Vite URL shown in the terminal.

## API Routes

### Auth

| Method | Route                     | Auth          |
| ------ | ------------------------- | ------------- |
| POST   | `/api/auth/register`      | No            |
| POST   | `/api/auth/login`         | No            |
| GET    | `/api/auth/me`            | Yes           |
| POST   | `/api/auth/refresh-token` | Refresh token |
| POST   | `/api/auth/logout`        | Yes           |

### Products

| Method | Route               | Auth |
| ------ | ------------------- | ---- |
| GET    | `/api/products`     | No   |
| GET    | `/api/products/:id` | No   |
| POST   | `/api/products`     | Yes  |
| PUT    | `/api/products/:id` | Yes  |
| DELETE | `/api/products/:id` | Yes  |

## Authentication

After login, the frontend stores the access token and refresh token.

The access token is sent with protected requests. If the access token expires, the Axios interceptor uses the refresh token to get a new access token and retries the original request.

On logout, the refresh token is removed from the user account.

## Validation

`express-validator` is used for authentication and product validation.

Invalid requests return `400` with the validation errors.

## Live Project

**Frontend:** https://authentication-product-crud.vercel.app/

**Backend:** https://authenticationproductcrud.onrender.com/

## GitHub

https://github.com/harshpurvak/AuthenticationProductCrud
