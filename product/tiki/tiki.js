const cheerio = require('cheerio');
const string_helper = require('../../helper/string_helper');
const isExist = require('../../func/is_exist');
const saveProduct = require('../../func/save_product');
var Product = require("../../model/product");

const getProductInfo = async (html, link) => {
    const $ = cheerio.load(html);

    const productName = $('h1.title').text();
    const productPrice = $('span.product-price__current-price').text();
    const flashSalePrice = $('div.flash-sale-price > span').text();

    let trademark = '';
    $('tr').map((i, element) => {
        if ($(element).text().includes('Thương hiệu')) {
            trademark = $(element).text().replace('Thương hiệu', '');
        }
    });

    const currentPrice = !string_helper.isEmpty(productPrice) ? productPrice : flashSalePrice;


    if(string_helper.isEmpty(currentPrice)) {
        return;
    }

    if(!(await isExist.isExist(link))) {
        const object = {
            name: productName,
            current_price: currentPrice.match(/\d/g).join(''),
            brand: trademark,
            link: link,
            from: "tiki"
        };
        await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );

        
    } else {
        let product = await Product.findOne({
            where: { 
                link: link
            },
        });

        if('' + product.current_price !==  productPrice.match(/\d/g).join('')) {
            const object = {
                name: productName,
                current_price: currentPrice.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "tiki"
            };
            await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
        }
    }
};

module.exports = { getProductInfo }