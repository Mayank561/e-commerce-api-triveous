
const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Order = require("../models/order")
// GET all categories
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.findAll();
        res.status(200).json({ success: true, data: categoryList });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// GET a single category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// CREATE a new category
router.post('/', async (req, res) => {
    try {
        const { name, icon, color } = req.body;
        const category = await Category.create({ name, icon, color });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
      // Extract the category ID from the request body
      const categoryId = req.body.categoryId;
  
      console.log('Received categoryId:', categoryId);
  
      // Verify that the category ID is provided
      if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
  
      // Check if the category exists
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      console.log('Category found:', category);
  
      // Create the order with the provided category ID
      const order = await Order.create({
        ...req.body,
        categoryId: categoryId
      });
  
      // Send the response with the created order
      res.status(201).json(order);
    } catch (error) {
      // Handle any errors
      console.error('Error creating order:', error);
      errorHandler(error, req, res);
    }
  });
  
  
// DELETE a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRowCount = await Category.destroy({ where: { id: req.params.id } });
        if (deletedRowCount === 0) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.status(200).json({ success: true, message: 'Category deleted.' });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;

/**
 * swagger: "3.0.0"
info:
  title: "Category API"
  description: "API for managing categories"
  version: "1.0.0"
tags:
  - name: "Categories"
    description: "API endpoints for managing categories"
paths:
  /:
    get:
      summary: "Get all categories"
      description: "Retrieve a list of all categories."
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Category"
        500:
          description: "Internal Server Error"
    post:
      summary: "Create a new category"
      description: "Create a new category with the provided name, icon, and color."
      parameters:
        - in: "body"
          name: "body"
          description: "Category object that needs to be added"
          required: true
          schema:
            $ref: "#/definitions/CategoryInput"
      responses:
        201:
          description: "Category created successfully"
          schema:
            $ref: "#/definitions/Category"
        500:
          description: "Internal Server Error"
  /{id}:
    get:
      summary: "Get category by ID"
      description: "Retrieve a single category by its ID."
      parameters:
        - in: "path"
          name: "id"
          required: true
          description: "ID of the category to retrieve"
          type: "string"
      responses:
        200:
          description: "Successful operation"
          schema:
            $ref: "#/definitions/Category"
        404:
          description: "Category not found"
        500:
          description: "Internal Server Error"
    delete:
      summary: "Delete category by ID"
      description: "Delete a category by its ID."
      parameters:
        - in: "path"
          name: "id"
          required: true
          description: "ID of the category to delete"
          type: "string"
      responses:
        200:
          description: "Category deleted successfully"
        404:
          description: "Category not found"
        500:
          description: "Internal Server Error"
definitions:
  Category:
    type: "object"
    properties:
      id:
        type: "integer"
        format: "int64"
      name:
        type: "string"
      icon:
        type: "string"
      color:
        type: "string"
  CategoryInput:
    type: "object"
    properties:
      name:
        type: "string"
      icon:
        type: "string"
      color:
        type: "string"

 */