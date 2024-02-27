const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../Database/db');
// const  OrderItem = require('./order-item');

class Order extends Model {}

Order.init({
  shippingAddress1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingAddress2: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending'
  },
  totalPrice: {
    type: DataTypes.FLOAT
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders'
});



module.exports = Order;
