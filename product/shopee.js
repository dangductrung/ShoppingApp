const cheerio = require('cheerio');
const isExist = require('../func/is_exist');
const saveProduct = require('../func/save_product');
const string_helper = require('../helper/string_helper');
var Product = require("../model/product");

const getProductInfo = async (html, link) => {
    const $ =  cheerio.load(html);

    const productName = $('div.attM6y > span').text();
    let productPrice = $('div._3e_UQT').text();
    const trademark = $('div.aPKXeO > a._3Qy6bH').text();
    productPrice = productPrice.split('-')[0]
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
                        from: "shopee"
                    };
                    await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
                }
            }
        });
    }
};

module.exports = { getProductInfo }