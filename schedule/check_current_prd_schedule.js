const schedule = require('node-schedule');
const crawler = require('../crawl/get_link');
const Product = require('../model/product');

const crawl = async () => {
    const products = await Product.findAll();
    for(i = 0;i<products.length ; ++i) {
        await crawler.getPageContent(products[i].link, products[i].from);
    }
};

module.exports = { crawl }