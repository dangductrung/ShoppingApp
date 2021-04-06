const crawler = require('./crawl');
const tiki_target = "https://tiki.vn";
const tiki_base_url = "https://tiki.vn";
const fs = require('fs');

const tiki_crawl = async  () => {
    fs.truncate(__dirname + "/links/" + 'tiki.txt', 0,async function(){
         await crawler.crawl(tiki_base_url,tiki_target, "tiki")
    });
}

module.exports = { tiki_crawl }