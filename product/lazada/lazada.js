const cheerio = require('cheerio');
const isExist = require('../../func/is_exist');
const saveProduct = require('../../func/save_product');
const string_helper = require('../../helper/string_helper');
var Product = require("../../model/product");

 const getProductInfo = async (html, link) => {
    const $ = cheerio.load(html);

    const productName = $('h1.pdp-mod-product-badge-title').text();
    const productPrice = $('span.pdp-price_type_normal').text();
    const beforePrice = $('span.pdp-price_type_deleted').text();
    const discount = $('span.pdp-product-price__discount').text();
    const trademark = $('a.pdp-product-brand__brand-link').text();


    if(string_helper.isEmpty(productName)) {
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
            from: "lazada"
        };
        await saveProduct.saveProduct(object.name, object.current_price, object.before_price, object.discount, object.brand, object.link, object.from );
    } else {
        let product = await Product.findOne({
            where: { 
                link: link
            },
        });
    
        if('' + product.current_price !==  productPrice.match(/\d/g).join('')) {
            const object = {
                name: productName,
                current_price: productPrice.match(/\d/g).join(''),
                before_price: beforePrice.match(/\d/g).join(''),
                discount: discount.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "lazada"
            };
            await saveProduct.saveProduct(object.name, object.current_price, object.before_price, object.discount, object.brand, object.link, object.from );
        }
    }
};

module.exports = { getProductInfo }