const sequilize = require("../ultils/serialize.util");
const { Sequelize, Model, DataTypes } = require('sequelize');


var Product = sequilize.define('products', {
    id: {
        type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
    } ,
    name: DataTypes.STRING(300),
    brand: DataTypes.STRING(255),
    from: DataTypes.STRING(25),
    link: DataTypes.STRING(255) ,
    match_id: DataTypes.INTEGER ,
    created_at: DataTypes.DATE ,
    current_price: DataTypes.FLOAT,
    before_price: DataTypes.FLOAT,
    discount: DataTypes.FLOAT
},  {timestamps: false,});


module.exports = Product;