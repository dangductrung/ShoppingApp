var seq = require('sequelize');

var sequelize = new seq('shopping', 'root', 'Dangductrung@@123Th', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        idle: 10000
    },
});

module.exports = sequelize;