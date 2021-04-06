const crawler = require('../crawl/get_link');

const crawl = async (base_url ,url, url2, url3, type) => {

    try {
        let pageHTML = await crawler.getPageContent(url, url2, url3, type);
    }catch(e) {
        console.log("Puppeteer error: " , e);
        crawl(base_url ,url, url2, url3, type);
    }
}

module.exports = { crawl }