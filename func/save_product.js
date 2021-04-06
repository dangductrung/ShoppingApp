 var Product = require("../model/product.js");
const string_helper = require('../helper/string_helper');
const dateFormat = require('dateformat');

 const saveProduct = async (name,current_price,brand,link,from ) => {

    var dateNow = new Date()
    .toLocaleString("sv", { timeZone: "Asia/Ho_Chi_Minh" });
    try {
        await Product.create({
            name: name,
            brand: brand,
            from: from,
            link: link,
            current_price: current_price,
            created_at: dateFormat(dateNow, 'yyyy-mm-dd HH:MM:ss')
        });
    } catch(e) {
        console.log(e);
    }
};

module.exports = { saveProduct }