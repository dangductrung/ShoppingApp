const cheerio = require('cheerio');
const getProductInfo = (html) => {
    const $ = cheerio.load(html);

    const productName = $('div._3ZV7fL > span').text();
    const productPrice = $('div.AJyN7v').text();
    const beforePrice = $('div.bBOoii').text();
    const discount = $('div._3ghar9').text();
    const trademark = $('div._2gVYdB > a._3yEY86').text();

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