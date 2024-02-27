# E-commerce API

This API serves as the backend for an e-commerce platform. It provides various endpoints for managing categories, products, users, orders, and search functionality.

## Table of Contents

- [Endpoints](#endpoints)
  - [Categories](#categories)
  - [Products](#products)
  - [Users](#users)
  - [Orders](#orders)
  - [Search](#search)

## Endpoints

### Categories

- **GET /api/v1/categories:** Get all categories.

  Example:
  ```http
  GET /api/v1/categories


- **GET /api/v1/categories/:id: Get a category by ID.
- Example:
- GET /api/v1/categories/1
  
- **POST /api/v1/categories: Create a new category.
- Example:

- POST /api/v1/categories
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Category for electronic products"
}
