const sequilize = require("../ultils/serialize.util");
const { Sequelize, Model, DataTypes } = require('sequelize');


var Crawled = sequilize.define('crawleds', {
    id: {
        type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
    } ,
    link: DataTypes.STRING(255),
    source: DataTypes.STRING(20),
},  {timestamps: false,});


module.exports = Crawled;