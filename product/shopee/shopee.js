const cheerio = require('cheerio');
const isExist = require('../../func/is_exist');
const saveProduct = require('../../func/save_product');
const string_helper = require('../../helper/string_helper');
var Product = require("../../model/product");

const getProductInfo = async (html, link) => {
    const $ =  cheerio.load(html);

    const productName = $('div._3ZV7fL > span').text();
    const productPrice = $('div.AJyN7v').text();
    const beforePrice = $('div.bBOoii').text();
    const discount = $('div._3ghar9').text();
    const trademark = $('div._2gVYdB > a._3yEY86').text();


    if(string_helper.isEmpty(productPrice)) {
        return;
    }
    if(beforePrice === null || beforePrice === "undefined") {
        beforePrice = 0;
    }

    if(discount === null || discount === "undefined") {
        discount = 0;
    }

    if(!(await isExist.isExist(link))) {
        const object = {
            name: productName,
            current_price: productPrice.match(/\d/g).join(''),
            before_price: beforePrice.match(/\d/g).join(''),
            discount: discount.match(/\d/g).join(''),
            brand: trademark,
            link: link,
            from: "shopee"
        };
        await saveProduct.saveProduct(object.name, object.current_price, object.before_price, object.discount, object.brand, object.link, object.from );
        return;
    } else {
        let product = await Product.findOne({
            where: { 
                link: link
            },
        });
    
        if('' + product.current_price !== productPrice.match(/\d/g).join('')) {
            const object = {
                name: productName,
                current_price: productPrice.match(/\d/g).join(''),
                before_price: beforePrice.match(/\d/g).join(''),
                discount: discount.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "shopee"
            };
            await saveProduct.saveProduct(object.name, object.current_price, object.before_price, object.discount, object.brand, object.link, object.from );
        }
        return;
    }
};

module.exports = { getProductInfo }