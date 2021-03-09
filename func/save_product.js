var Product = require("../model/product.js");
const string_helper = require('../helper/string_helper');

 const saveProduct = async (name,current_price,before_price, discount,brand,link,from ) => {
    var dateNow = new Date()
    .toLocaleString("sv", { timeZone: "Asia/Ho_Chi_Minh" })
    .slice(0, 19)
    .replace("T", " ");

    if(string_helper.isEmpty(name)) {
        return;
    }


    await Product.create({
        name: name,
        brand: brand,
        from: from,
        link: link,
        current_price: current_price,
        before_price: before_price,
        discount: discount,
        created_at: dateNow
    });
};

module.exports = { saveProduct }