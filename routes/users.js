const express = require("express");
const router = express.Router();
const  User  = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users
router.get("/", async (req, res) => {
  try {
    const userList = await User.findAll({ attributes: { exclude: ['passwordHash'] } });

    if (!userList) {
      return res
        .status(500)
        .json({ success: false, error: "Unable to retrieve users" });
    }

    res.send(userList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    });

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Update user by ID
router.put("/:id", async (req, res) => {
  try {
    const userExist = await User.findByPk(req.params.id);
    let newPassword;

    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }

    const [_, updatedUser] = await User.update({
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    }, {
      where: { id: req.params.id },
      returning: true
    });

    res.status(200).json(updatedUser); // Send the updated user object as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// User login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    const secret = process.env.secret;

    if (!user) {
      return res.status(400).send("The user not found");
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin
        },
        secret,
        { expiresIn: "1d" }
      );

      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("Password is wrong!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// User registration
router.post("/register", async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    });

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.destroy({ where: { id: req.params.id } });

    if (deletedUser) {
      return res
        .status(200)
        .json({ success: true, message: "The user is deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

// Get user count
router.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.count();

    if (!userCount) {
      return res
        .status(500)
        .json({ success: false, error: "Unable to retrieve user count" });
    }

    res.status(200).json({ success: true, userCount: userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;


/**
 * swagger: "3.0.0"
tags:
  - name: Categories
    description: API for managing users
paths:
  /:
    get:
      description: Get all users
      responses:
        200:
          description: Successful operation
          schema:
            type: array
            items:
              $ref: "#/definitions/User"
        500:
          description: Internal Server Error
    post:
      description: Create a new user
      parameters:
        - in: body
          name: user
          description: The user to create
          required: true
          schema:
            $ref: "#/definitions/User"
      responses:
        200:
          description: User created successfully
          schema:
            $ref: "#/definitions/User"
        500:
          description: Internal Server Error
  /{id}:
    get:
      description: Get user by ID
      parameters:
        - in: path
          name: id
          description: ID of the user to retrieve
          required: true
          type: integer
      responses:
        200:
          description: Successful operation
          schema:
            $ref: "#/definitions/User"
        404:
          description: User not found
        500:
          description: Internal Server Error
    put:
      description: Update user by ID
      parameters:
        - in: path
          name: id
          description: ID of the user to update
          required: true
          type: integer
        - in: body
          name: user
          description: Updated user object
          required: true
          schema:
            $ref: "#/definitions/User"
      responses:
        200:
          description: User updated successfully
          schema:
            $ref: "#/definitions/User"
        404:
          description: User not found
        500:
          description: Internal Server Error
    delete:
      description: Delete user by ID
      parameters:
        - in: path
          name: id
          description: ID of the user to delete
          required: true
          type: integer
      responses:
        200:
          description: User deleted successfully
        404:
          description: User not found
        500:
          description: Internal Server Error
definitions:
  User:
    type: object
    properties:
      id:
        type: integer
      name:
        type: string
      email:
        type: string
      password:
        type: string
      phone:
        type: string
      isAdmin:
        type: boolean
      street:
        type: string
      apartment:
        type: string
      zip:
        type: string
      city:
        type: string
      country:
        type: string

 */