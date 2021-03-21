const crawler = require('./crawl');
const shopee_target = "https://shopee.vn/-SI%C3%8AU-R%E1%BA%BA-Rule-1-Th%E1%BB%B1c-Ph%E1%BA%A9m-T%C4%83ng-C%C6%A1-5lbs-i.48291728.9207077746";
const shopee_base_url = "https://shopee.vn";
const fs = require('fs');

const shopee_crawl = async () => {
    fs.truncate( __dirname + "/links/" + 'shopee.txt', 0,async function(){
         await crawler.crawl(shopee_base_url,shopee_target, "shopee")
    });
}

module.exports = { shopee_crawl }