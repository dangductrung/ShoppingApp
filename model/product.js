const sequilize = require("../ultils/serialize.util");
const { Sequelize, Model, DataTypes } = require('sequelize');


var Product = sequilize.define('products', {
    id: {
        type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
    } ,
    name: DataTypes.STRING(500),
    brand: DataTypes.STRING(150),
    from: DataTypes.STRING(45),
    link: DataTypes.STRING(1500) ,
    match_id: DataTypes.INTEGER ,
    created_at: DataTypes.DATE ,
    current_price: DataTypes.FLOAT,
    image: DataTypes.STRING(1500),
    delta: DataTypes.FLOAT,
},  {
    charset: 'utf8mb4',
    timestamps: false,
});


module.exports = Product;