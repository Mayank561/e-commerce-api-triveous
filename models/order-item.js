const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../Database/db');
const { Order }= require('./order');

class OrderItem extends Model {}

OrderItem.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'orderitems'
  }
);



module.exports = OrderItem;
