const cheerio = require('cheerio');
const string_helper = require('../helper/string_helper');
const getProductInfo = (html) => {
    const $ = cheerio.load(html);

    const productName = $('h1.title').text();
    const productPrice = $('span.product-price__current-price').text();
    const flashSalePrice = $('div.flash-sale-price > span').text();
    const beforePrice = $('span.product-price__list-price').text();
    const discount = $('span.product-price__discount-rate').text();

    let trademark = '';
    $('tr').map((i, element) => {
        if ($(element).text().includes('Thương hiệu')) {
            trademark = $(element).text().replace('Thương hiệu', '');
        }
    });

    const currentPrice = !string_helper.isEmpty(productPrice) ? productPrice : flashSalePrice;
    const object = {
        name: productName,
        currentPrice: currentPrice.match(/\d/g).join(''),
        beforePrice: beforePrice.match(/\d/g).join(''),
        discount: discount.match(/\d/g).join(''),
        brand: trademark
    };

    console.log(object);
    return object;
};

module.exports = { getProductInfo }