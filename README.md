E-commerce API
This API serves as the backend for an e-commerce platform. It provides various endpoints for managing categories, products, users, orders, and search functionality.

Table of Contents
Endpoints
Categories
Products
Users
Orders
Search
Endpoints
Categories
GET /api/v1/categories: Get all categories.

Example:

http
Copy code
GET /api/v1/categories
GET /api/v1/categories/:id: Get a category by ID.

Example:

http
Copy code
GET /api/v1/categories/1
POST /api/v1/categories: Create a new category.

Example:

http
Copy code
POST /api/v1/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Category for electronic products"
}
PUT /api/v1/categories/:id: Update a category by ID.

Example:

http
Copy code
PUT /api/v1/categories/1
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Category for electronic products (updated)"
}
DELETE /api/v1/categories/:id: Delete a category by ID.

Example:

http
Copy code
DELETE /api/v1/categories/1
Products
GET /api/v1/products: Get all products.

Example:

http
Copy code
GET /api/v1/products
GET /api/v1/products/:id: Get a product by ID.

Example:

http
Copy code
GET /api/v1/products/1
POST /api/v1/products: Create a new product.

Example:

http
Copy code
POST /api/v1/products
Content-Type: application/json

{
  "name": "Smartphone",
  "description": "A high-end smartphone",
  "price": 999.99,
  "category_id": 1
}
PUT /api/v1/products/:id: Update a product by ID.

Example:

http
Copy code
PUT /api/v1/products/1
Content-Type: application/json

{
  "price": 899.99
}
DELETE /api/v1/products/:id: Delete a product by ID.

Example:

http
Copy code
DELETE /api/v1/products/1
Users
GET /api/v1/users: Get all users.

Example:

http
Copy code
GET /api/v1/users
GET /api/v1/users/:id: Get a user by ID.

Example:

http
Copy code
GET /api/v1/users/1
POST /api/v1/users: Create a new user.

Example:

http
Copy code
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
PUT /api/v1/users/:id: Update a user by ID.

Example:

http
Copy code
PUT /api/v1/users/1
Content-Type: application/json

{
  "name": "Updated John Doe"
}
DELETE /api/v1/users/:id: Delete a user by ID.

Example:

http
Copy code
DELETE /api/v1/users/1
Orders
GET /api/v1/orders: Get all orders.

Example:

http
Copy code
GET /api/v1/orders
GET /api/v1/orders/:id: Get an order by ID.

Example:

http
Copy code
GET /api/v1/orders/1
POST /api/v1/orders: Create a new order.

Example:

http
Copy code
POST /api/v1/orders
Content-Type: application/json

{
  "user_id": 1,
  "product_id": 1,
  "quantity": 2
}
PUT /api/v1/orders/:id: Update an order by ID.

Example:

http
Copy code
PUT /api/v1/orders/1
Content-Type: application/json

{
  "quantity": 3
}
DELETE /api/v1/orders/:id: Delete an order by ID.

Example:

http
Copy code
DELETE /api/v1/orders/1
Search
GET /api/v1/search?term=:term: Search for products by name or description.

Example:

http
Copy code
GET /api/v1/search?term=smartphone