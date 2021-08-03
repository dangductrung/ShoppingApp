 var Product = require("../model/product.js");
const string_helper = require('../helper/string_helper');
const dateFormat = require('dateformat');

 const saveProduct = async (name,current_price,brand,link,from, imageLink ) => {
    let finalLink = link;
    if(finalLink.includes("?")) {
        let linkArr = link.split("?");
        let linkRes = linkArr.slice(0, linkArr.length - 1).join("");
        finalLink = linkRes;
    }


    var dateNow = new Date()
    .toLocaleString("sv", { timeZone: "Asia/Ho_Chi_Minh" });
    try {
        await Product.create({
            name: name,
            brand: brand,
            from: from,
            link: finalLink,
            current_price: current_price,
            created_at: dateFormat(dateNow, 'yyyy-mm-dd HH:MM:ss'),
            image: imageLink
        });
    } catch(e) {
        console.log(e);
    }
};

module.exports = { saveProduct }