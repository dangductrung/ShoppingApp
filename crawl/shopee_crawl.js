const crawler = require('./crawl');
const getLink = require('./get_link');
const shopee_target = "https://shopee.vn/Whey-Protein-HydroPure-Nutrabonics-100-Th%E1%BB%A7y-Ph%C3%A2n-T%C4%83ng-C%C6%A1-Gi%E1%BA%A3m-M%E1%BB%A1-H%E1%BB%99p-2.04kg-i.330753094.5361642843";
const shopee_base_url = "https://shopee.vn";
const fs = require('fs');

const shopee_crawl = async () => {
    // await getLink.initPage();
    fs.truncate( __dirname + "/links/" + 'shopee.txt', 0,async function(){
         await crawler.crawl(shopee_base_url,shopee_target, "shopee")
    });
}

module.exports = { shopee_crawl }