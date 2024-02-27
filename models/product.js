const { DataTypes } = require('sequelize');
const { sequelize } = require('../Database/db');
const Category = require('./category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    richDescription: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    brand: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    countInStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 255
        }
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dateCreated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Define associations
Product.belongsTo(Category); 

module.exports = Product;
