const crawler = require('./crawl');
const crawledLink = require('../model/crawled');
const lazada_target = "https://lazada.vn";
const lazada_base_url = "https://lazada.vn";

const lazada_crawl = () => {
    crawledLink.destroy(
        {  where: {
            source: "lazada"
        },
        truncate: true
      }).then(function(affected) {
          crawler.crawl(lazada_base_url,lazada_target, "lazada")
    });
}

module.exports = { lazada_crawl }