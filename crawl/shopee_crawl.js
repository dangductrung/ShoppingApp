const crawler = require('./crawl');
const crawledLink = require('../model/crawled');
const shopee_target = "https://shopee.vn";
const shopee_base_url = "https://shopee.vn";

const shopee_crawl =  () => {
    crawledLink.destroy(
        {  where: {
            source: "shopee"
        },
        truncate: true
      }).then(async function(affected) {
      crawler.crawl(shopee_base_url,shopee_target, "shopee")
    });
}

module.exports = { shopee_crawl }