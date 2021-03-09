const crawler = require('./crawl');
const crawledLink = require('../model/crawled');
const tiki_target = "https://tiki.vn";
const tiki_base_url = "https://tiki.vn";

const tiki_crawl = () => {
    crawledLink.destroy(
        {  where: {
            source: "tiki"
        },
        truncate: true
      }).then(function(affected) {
          crawler.crawl(tiki_base_url,tiki_target, "tiki")
    });
}

module.exports = { tiki_crawl }