# Authentication & Product CRUD

This project was built as part of the Sheryians Coding School assignment.

The main purpose of this project is to build a JWT-based authentication system, create Product CRUD APIs, validate the API inputs using `express-validator`, and connect everything with a React frontend.

## Tech Used

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* express-validator
* cookie-parser
* CORS

### Frontend

* React
* Vite
* React Router
* Axios

## What I Built

### Authentication

The authentication system includes:

* User registration
* User login
* Access token
* Refresh token
* Refresh token stored in an httpOnly cookie
* Refresh token stored with the user for revocation
* Automatic access token refresh
* Logout
* Logged-in user details
* Protected routes

During registration, the password is hashed using bcrypt before it is stored in the database.

After login, the backend sends the access token in the response. The refresh token is stored in an httpOnly cookie, so it is not directly accessible from frontend JavaScript.

### Product CRUD

The Product API supports:

* Creating a product
* Getting all products
* Getting a product by ID
* Updating a product
* Deleting a product

Creating, updating and deleting products require a valid access token.

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
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md
```

## How Authentication Works

When a user registers, the password is first hashed using bcrypt and then saved in MongoDB.

When the user logs in, the backend checks the email and password. If they are correct, two tokens are created:

* Access token — expires in 15 minutes
* Refresh token — expires in 7 days

The access token is returned in the login response and is used for protected API requests.

The refresh token is stored in an httpOnly cookie and also stored with the user in the database.

When the access token expires, the frontend sends a request to the refresh-token endpoint. The browser automatically sends the refresh token cookie with that request. The backend verifies it and sends back a new access token.

When the user logs out, the stored refresh token is removed and the refresh token cookie is cleared.

## Validation

I used `express-validator` for validating authentication and product requests.

For example, registration checks the name, email, password and confirm password. Product requests also validate fields such as price, stock, category and product ID.

If the request is invalid, the API returns a `400` response with the validation errors

## API Routes

### Authentication

| Method | Route                     | Access        |
| ------ | ------------------------- | ------------- |
| POST   | `/api/auth/register`      | Public        |
| POST   | `/api/auth/login`         | Public        |
| POST   | `/api/auth/refresh-token` | Refresh Token |
| POST   | `/api/auth/logout`        | Authenticated |
| GET    | `/api/auth/me`            | Authenticated |

### Products

| Method | Route               | Access        |
| ------ | ------------------- | ------------- |
| GET    | `/api/products`     | Public        |
| GET    | `/api/products/:id` | Public        |
| POST   | `/api/products`     | Authenticated |
| PUT    | `/api/products/:id` | Authenticated |
| DELETE | `/api/products/:id` | Authenticated |

## Frontend

The frontend has:

* Register page
* Login page
* Protected Products page
* Product listing
* Create product form
* Edit product form
* Delete functionality
* Logout

Axios is used to communicate with the backend API.

The access token is stored on the frontend and sent in the `Authorization` header for protected requests.

## Running the Project Locally

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Run the backend:

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

For local development, the frontend API URL can be set using:

```env
VITE_API_URL=http://localhost:5000/api
```

## Live Project

Frontend:
https://authentication-product-crud.vercel.app/

Backend:
https://authenticationproductcrud.onrender.com/

## GitHub

https://github.com/harshpurvak/AuthenticationProductCrud
