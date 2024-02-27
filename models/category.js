const { DataTypes } = require('sequelize');
const { sequelize } = require('../Database/db');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING
    }
});

module.exports = Category;
