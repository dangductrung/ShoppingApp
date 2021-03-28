const crawler = require('../crawl/get_link');

const crawl = async (base_url ,url, type) => {
    try {
        let pageHTML = await crawler.getPageContent(url, type);
    }catch(e) {
        console.log("Puppeteer error: " , e);
        crawl(base_url ,url, type);
    }
}

module.exports = { crawl }