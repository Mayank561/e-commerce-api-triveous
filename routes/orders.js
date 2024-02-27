const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { OrderItem }   = require('../models/order-item');
const errorHandler = require('../Database/error-handler.js');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// GET a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// POST a new order
router.post('/', async (req, res) => {
  try {
    // Extract userId from request body
    const userId = req.body.userId;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Create the order with userId and other order details
    const order = await Order.create({
      ...req.body,
      userId: userId // Assign userId to the order
    });

    // Send success response with created order
    res.status(201).json(order);
  } catch (error) {
    // Handle error
    errorHandler(error, req, res);
  }
});
// PUT (update) an existing order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.update(req.body);
    res.status(200).json(order);
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Delete endpoint for deleting an order by ID
router.delete('/:id', async (req, res) => {
  try {
    // Find the order by its ID
    const order = await Order.findByPk(req.params.id);

    // If the order does not exist, return a 404 response
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If the order exists, delete it from the database
    await order.destroy();

    // Send a JSON response indicating successful deletion
    res.status(200).json({ message: `Order with ID ${req.params.id} has been successfully deleted.` });
  } catch (error) {
    // If an error occurs during the process, handle it using the errorHandler function
    errorHandler(error, req, res);
  }
});
// Endpoint to get the count of orders
router.get('/get/count', async (req, res) => {
  try {
    const orderCount = await Order.count();
    res.status(200).json({ orderCount });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Endpoint to get the total sales
router.get('/get/totalsales', async (req, res) => {
  try {
    const totalSales = await Order.sum('totalPrice');
    console.log('Total Sales:', totalSales); 
    res.status(200).json({ totalSales });
  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Endpoint to get orders of a specific user by user ID
router.get('/get/userorders/:userId', async (req, res) => {
  try {
    const userOrders = await Order.findAll({ where: { userId: req.params.userId } });
    console.log('User Orders:', userOrders); 
    res.status(200).json(userOrders);
  } catch (error) {
    errorHandler(error, req, res);
  }
});


module.exports = router;



/**
 * swagger: "3.0.0"
info:
  title: "Categories API"
  description: "API for managing orders"
  version: "1.0.0"
paths:
  /:
    get:
      tags:
        - "Categories"
      summary: "Get all orders"
      description: "Get all orders"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Order"
        500:
          description: "Internal Server Error"
    post:
      tags:
        - "Categories"
      summary: "Create a new order"
      description: "Create a new order"
      parameters:
        - in: "body"
          name: "body"
          description: "Order object that needs to be added"
          required: true
          schema:
            $ref: "#/definitions/Order"
      responses:
        201:
          description: "Order created successfully"
          schema:
            $ref: "#/definitions/Order"
        500:
          description: "Internal Server Error"
  /{id}:
    get:
      tags:
        - "Categories"
      summary: "Get a specific order by ID"
      description: "Get a specific order by ID"
      parameters:
        - name: "id"
          in: "path"
          description: "ID of the order to return"
          required: true
          type: "string"
      responses:
        200:
          description: "Successful operation"
          schema:
            $ref: "#/definitions/Order"
        404:
          description: "Order not found"
        500:
          description: "Internal Server Error"
    put:
      tags:
        - "Categories"
      summary: "Update an existing order"
      description: "Update an existing order"
      parameters:
        - name: "id"
          in: "path"
          description: "ID of the order to update"
          required: true
          type: "string"
        - in: "body"
          name: "body"
          description: "Updated order object"
          required: true
          schema:
            $ref: "#/definitions/Order"
      responses:
        200:
          description: "Order updated successfully"
          schema:
            $ref: "#/definitions/Order"
        404:
          description: "Order not found"
        500:
          description: "Internal Server Error"
    delete:
      tags:
        - "Categories"
      summary: "Delete an order by ID"
      description: "Delete an order by ID"
      parameters:
        - name: "id"
          in: "path"
          description: "ID of the order to delete"
          required: true
          type: "string"
      responses:
        200:
          description: "Order deleted successfully"
        404:
          description: "Order not found"
        500:
          description: "Internal Server Error"
  /get/count:
    get:
      tags:
        - "Categories"
      summary: "Get the count of orders"
      description: "Get the count of orders"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "object"
            properties:
              orderCount:
                type: "integer"
                format: "int64"
        500:
          description: "Internal Server Error"
  /get/totalsales:
    get:
      tags:
        - "Categories"
      summary: "Get the total sales"
      description: "Get the total sales"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "object"
            properties:
              totalSales:
                type: "integer"
                format: "int64"
        500:
          description: "Internal Server Error"
  /get/userorders/{userId}:
    get:
      tags:
        - "Categories"
      summary: "Get orders of a specific user by user ID"
      description: "Get orders of a specific user by user ID"
      parameters:
        - name: "userId"
          in: "path"
          description: "ID of the user"
          required: true
          type: "string"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Order"
        500:
          description: "Internal Server Error"
definitions:
  Order:
    type: "object"
    properties:
      id:
        type: "integer"
        format: "int64"
      userId:
        type: "string"
        description: "ID of the user who placed the order"
      // Other order fields here

 */