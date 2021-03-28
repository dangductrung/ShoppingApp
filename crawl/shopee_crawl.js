const crawler = require('./crawl');
const getLink = require('./get_link');
const shopee_target = "https://shopee.vn";
const shopee_base_url = "https://shopee.vn";
const fs = require('fs');

const shopee_crawl = async () => {
    await getLink.initPage();
    fs.truncate( __dirname + "/links/" + 'shopee.txt', 0,async function(){
         await crawler.crawl(shopee_base_url,shopee_target, "shopee")
    });
}

module.exports = { shopee_crawl }