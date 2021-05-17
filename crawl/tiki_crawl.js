const crawler = require('./crawl');
const tiki_target = "https://tiki.vn/nature-s-way-alive-once-daily-men-s-multivitamin-ultra-potency-food-based-blends-60-tablets-p53162016.html?src=ss-organic";
const tiki_base_url = "https://tiki.vn";
const fs = require('fs');

const tiki_crawl = async  () => {
    fs.truncate(__dirname + "/links/" + 'tiki.txt', 0,async function(){
         await crawler.crawl(tiki_base_url,tiki_target, "tiki")
    });
}

module.exports = { tiki_crawl }