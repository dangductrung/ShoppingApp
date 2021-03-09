var seq = require('sequelize');

var sequelize = new seq('heroku_6dd61aff90cf7bc', 'bf429f27095475', '56349a0e', {
    host: 'us-cdbr-east-02.cleardb.com',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

module.exports = sequelize;