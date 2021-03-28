const crawler = require('../crawl/get_link');
const shopee = require('../product/shopee');
const tiki = require('../product/tiki');
const lazada = require('../product/lazada');

const crawl = async (base_url ,url, type) => {
    try {
        let pageHTML = await crawler.getPageContent(url, type);
        if(pageHTML == null) {
            return;
        }
        var links = crawler.getPageLink(pageHTML);
    
        links_filted = crawler.filterLink(base_url, links, type);
    
        switch(type) {
            case "shopee": 
                shopee.getProductInfo(pageHTML, url).then( () => {
                    crawlnext(base_url, links, type);
                });
                break;
            case "lazada": 
                lazada.getProductInfo(pageHTML, url).then( () => {
                    crawlnext(base_url, links, type);
                });
                break;
            case "tiki": 
                tiki.getProductInfo(pageHTML, url).then( () => {
                    crawlnext(base_url, links, type);
                });
                break;
        }
    }catch(e) {
        console.log("Puppeteer error: " , e);
        crawl(base_url ,url, type);
    }
}

const crawlnext = (base_url, links, type) => {
    for(i = 0; i<links.length; ++i) {
        crawl(base_url, links[i], type);
    }
};

module.exports = { crawl }