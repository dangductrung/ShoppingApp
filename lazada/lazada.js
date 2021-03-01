const cheerio = require('cheerio');
const getProductInfo = (html) => {
    const $ = cheerio.load(html);

    const productName = $('h1.pdp-mod-product-badge-title').text();
    const productPrice = $('span.pdp-price_type_normal').text();
    const beforePrice = $('span.pdp-price_type_deleted').text();
    const discount = $('span.pdp-product-price__discount').text();
    const trademark = $('a.pdp-product-brand__brand-link').text();

    const object = {
        name: productName,
        currentPrice: productPrice.match(/\d/g).join(''),
        beforePrice: beforePrice.match(/\d/g).join(''),
        discount: discount.match(/\d/g).join(''),
        brand: trademark
    };

    console.log(object);
    return object;
};

module.exports = { getProductInfo }