
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project_ass', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
    define: {
        timestamps: true 
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    sequelize,
    connectDB
};
