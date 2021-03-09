const sequilize = require("../utils/serialize.util");
const { Sequelize, Model, DataTypes } = require('sequelize');


var Match = sequilize.define('matchs', {
    id: {
        type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
    } ,
    product_id: DataTypes.INTEGER
},  {timestamps: false,});


module.exports = Match;