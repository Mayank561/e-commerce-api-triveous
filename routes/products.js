const express = require("express");
const router = express.Router();
const Product  = require("../models/product");
const Category   = require("../models/category");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    if (!isValid) {
      const error = new Error("Invalid image type");
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ storage: storage });

const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, error: message });
};


router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category_id: req.query.categories.split(",") };
    }
    
    const productList = await Product.findAll({
      where: filter,
      include: [{ model: Category, attributes: ['id', 'name', 'icon', 'color'] }]
    });

    res.status(200).json({ success: true, data: productList });
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }]
    });
    if (!product) {
      sendErrorResponse(res, 404, "Product not found");
    }
    res.status(200).json(product);
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});

router.post("/", uploadOptions.single("image"), async (req, res) => {
  try {
    const category = await Category.findByPk(req.body.category);
    if (!category) {
      sendErrorResponse(res, 400, "Invalid Category");
    }
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription || "",
      image: req.file.filename,
      brand: req.body.brand || "",
      price: req.body.price || 0,
      category_id: req.body.category,
      countInStock: req.body.countInStock || 0,
      rating: req.body.rating || 0,
      numReviews: req.body.numReviews || 0,
      isFeatured: req.body.isFeatured || false
    });
    res.status(201).json(product);
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      sendErrorResponse(res, 404, "Product not found");
    }
    const updatedProduct = await product.update({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription || product.richDescription,
      image: req.file ? req.file.filename : product.image,
      brand: req.body.brand || product.brand,
      price: req.body.price || product.price,
      category_id: req.body.category || product.category_id,
      countInStock: req.body.countInStock || product.countInStock,
      rating: req.body.rating || product.rating,
      numReviews: req.body.numReviews || product.numReviews,
      isFeatured: req.body.isFeatured || product.isFeatured
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      sendErrorResponse(res, 404, "Product not found");
    }
    await product.destroy();
    res.status(200).json({
      success: true,
      message: "The product is deleted!"
    });
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.count();
    res.status(200).json({ productCount });
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});

router.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count || 0;
    const products = await Product.findAll({
      where: { isFeatured: true },
      limit: +count
    });
    res.status(200).json(products);
  } catch (error) {
    sendErrorResponse(res, 500, error.message || "Internal Server Error");
  }
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        sendErrorResponse(res, 404, "Product not found");
      }
      const files = req.files;
      let imagesPaths = [];
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      if (files) {
        files.forEach(file => {
          imagesPaths.push(`${basePath}${file.filename}`);
        });
      }
      await product.update({ images: imagesPaths });
      res.status(200).json(product);
    } catch (error) {
      sendErrorResponse(res, 500, error.message || "Internal Server Error");
    }
  }
);

module.exports = router;


/**
 * swagger: "3.0.0"
tags:
  - name: "Categories"
    description: "API for managing products"
paths:
  /:
    get:
      description: "Get all products"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Product"
        500:
          description: "Internal Server Error"
    post:
      description: "Create a new product"
      parameters:
        - in: "body"
          name: "body"
          description: "Product object that needs to be added"
          required: true
          schema:
            $ref: "#/definitions/Product"
      responses:
        201:
          description: "Product created successfully"
          schema:
            $ref: "#/definitions/Product"
        500:
          description: "Internal Server Error"
  /{id}:
    get:
      description: "Get a specific product by ID"
      parameters:
        - in: "path"
          name: "id"
          required: true
          description: "ID of the product to retrieve"
          type: "string"
      responses:
        200:
          description: "Successful operation"
          schema:
            $ref: "#/definitions/Product"
        404:
          description: "Product not found"
        500:
          description: "Internal Server Error"
    put:
      description: "Update an existing product by ID"
      parameters:
        - in: "path"
          name: "id"
          required: true
          description: "ID of the product to update"
          type: "string"
        - in: "body"
          name: "body"
          description: "Updated product object"
          required: true
          schema:
            $ref: "#/definitions/Product"
      responses:
        200:
          description: "Product updated successfully"
          schema:
            $ref: "#/definitions/Product"
        404:
          description: "Product not found"
        500:
          description: "Internal Server Error"
    delete:
      description: "Delete a product by ID"
      parameters:
        - in: "path"
          name: "id"
          required: true
          description: "ID of the product to delete"
          type: "string"
      responses:
        200:
          description: "Product deleted successfully"
        404:
          description: "Product not found"
        500:
          description: "Internal Server Error"
  /get/count:
    get:
      description: "Get the count of products"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "object"
            properties:
              productCount:
                type: "integer"
                format: "int64"
        500:
          description: "Internal Server Error"
  /get/featured/{count}:
    get:
      description: "Get featured products with a specified count"
      parameters:
        - in: "path"
          name: "count"
          required: true
          description: "Number of featured products to retrieve"
          type: "integer"
          format: "int64"
      responses:
        200:
          description: "Successful operation"
          schema:
            type: "array"
            items:
              $ref: "#/definitions/Product"
        500:
          description: "Internal Server Error"
  /gallery-images/{id}:
    put:
      description: "Update gallery images of a product by ID"
      parameters:
        - in: "path"
          name: "id"
          required: true
          description: "ID of the product to update gallery images"
          type: "string"
        - in: "body"
          name: "body"
          description: "Updated gallery images"
          required: true
          schema:
            $ref: "#/definitions/ProductGallery"
      responses:
        200:
          description: "Gallery images updated successfully"
          schema:
            $ref: "#/definitions/Product"
        404:
          description: "Product not found"
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
  ProductGallery:
    type: "object"
    properties:
      images:
        type: "array"
        items:
          type: "string"

 */