const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const categoryId = req.query.category_id; 

    let query = {};

    if (searchTerm) {
      query[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { description: { [Op.like]: `%${searchTerm}%` } }
      ];
    }
    if (categoryId) { 
      query.category_id = categoryId; 
    }

    // Retrieve products based on the constructed query
    const products = await Product.findAll({ where: query });

    // If no products are found and a search term is provided, save a new product
    if (products.length === 0 && searchTerm) {
      const newProduct = await Product.create({
        name: searchTerm,
        description: searchTerm,
        richDescription: `${searchTerm} - rich description`,
        brand: searchTerm,
        price: parseFloat(searchTerm) || 0,
        rating: parseFloat(searchTerm) || 0,
        isFeatured: Boolean(searchTerm),
        countInStock: parseInt(searchTerm) || 0,
        numReviews: parseInt(searchTerm) || 0,
        dateCreated: new Date(),
        category_id: categoryId || null 
      });

      // Add the saved product to the response
      products.push(newProduct);
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;


/**
 * swagger: "3.0.0"
tags:
  - name: "Categories"
    description: "API for managing productsRoutes"
paths:
  /:
    get:
      description: "Search for products"
      parameters:
        - name: "term"
          in: "query"
          description: "Search term to filter products by name or description"
          required: false
          type: "string"
        - name: "category_id"
          in: "query"
          description: "ID of the category to filter products by"
          required: false
          type: "integer"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Product"
        500:
          description: "Internal Server Error"
definitions:
  Product:
    type: "object"
    properties:
      id:
        type: "integer"
        format: "int64"
      name:
        type: "string"
      description:
        type: "string"

 */