const cheerio = require('cheerio');
const isExist = require('../../func/is_exist');
const saveProduct = require('../../func/save_product');
const string_helper = require('../../helper/string_helper');
var Product = require("../../model/product");

const getProductInfo = async (html, link) => {
    const $ =  cheerio.load(html);

    const productName = $('div.attM6y > span').text();
    const productPrice = $('div._3e_UQT').text();
    const trademark = $('div.aPKXeO > a._3Qy6bH').text();


    if(string_helper.isEmpty(productPrice)) {
        return;
    }

    if(!(await isExist.isExist(link))) {
        const object = {
            name: productName,
            current_price: productPrice.match(/\d/g).join(''),
            brand: trademark,
            link: link,
            from: "shopee"
        };
        await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
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
                brand: trademark,
                link: link,
                from: "shopee"
            };
            await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
        }
        return;
    }
};

module.exports = { getProductInfo }