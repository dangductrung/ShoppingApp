const cheerio = require('cheerio');
const isExist = require('../func/is_exist');
const saveProduct = require('../func/save_product');
const string_helper = require('../helper/string_helper');
var Product = require("../model/product");

 const getProductInfo = async (html, link) => {
    const $ = cheerio.load(html);

    const productName = $('h1.pdp-mod-product-badge-title').text();
    const productPrice = $('span.pdp-price_type_normal').text();
    const trademark = $('a.pdp-product-brand__brand-link').text();


    if(string_helper.isEmpty(productName)) {
        return;
    }

    if(!(await isExist.isExist(link))) {
        const object = {
            name: productName,
            current_price: productPrice.match(/\d/g).join(''),
            brand: trademark,
            link: link,
            from: "lazada"
        };
        await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
    } else {
        await Product.findAll({
            limit: 1,
            where: { 
                link: link
            },
            order: [ [ 'created_at', 'DESC' ]]
        }).then(async function(entities) {
            if(entities.length > 0) {
                if('' + entities[0].current_price !==  productPrice.match(/\d/g).join('')) {
                    const object = {
                        name: productName,
                        current_price: productPrice.match(/\d/g).join(''),
                        brand: trademark,
                        link: link,
                        from: "lazada"
                    };
                    await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
                }
            }
        });
    }
};

module.exports = { getProductInfo }