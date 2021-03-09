var Product = require("../model/product.js");

 const isExist = async (link) => {
    if (link == undefined || link =="undefined" ||
    link == "javascript:void(0)" ||
    link.includes("login") ||
    link.includes("logout") ||
    link.includes("register")) {
    return true;
    }
    let product = await Product.findOne({
        where: { 
            link: link
        },
    });

    if(product instanceof Product && product !== null) {
        return true;
    }
    return false;
};
module.exports = { isExist }