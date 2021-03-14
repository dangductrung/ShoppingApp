const crawler = require('./crawl');
const lazada_target = "https://lazada.vn";
const lazada_base_url = "https://lazada.vn";
const fs = require('fs');

const lazada_crawl = async () => {
    fs.truncate(__dirname + "/links/" + 'lazada.txt', 0,async function(){
         await crawler.crawl(lazada_base_url,lazada_target, "lazada")
    });
}

module.exports = { lazada_crawl }