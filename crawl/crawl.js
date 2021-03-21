const crawler = require('../crawl/get_link');
const shopee = require('../product/shopee/shopee');
const tiki = require('../product/tiki/tiki');
const lazada = require('../product/lazada/lazada');

const crawl = async (base_url ,url, type) => {
    let pageHTML = await crawler.getPageContent(url, type);
    if(pageHTML == null) {
        return;
    }
    var links = crawler.getPageLink(pageHTML);

    links_filted = crawler.filterLink(base_url, links, type);

    for(i = 0; i<links.length; ++i) {
            switch(type) {
                case "shopee": 
                    await shopee.getProductInfo(pageHTML, url);
                    break;
                case "lazada": 
                    await lazada.getProductInfo(pageHTML, url);
                    break;
                case "tiki": 
                    await tiki.getProductInfo(pageHTML, url);
                    break;
        }
        await crawl(base_url, links[i], type);
    }
}

module.exports = { crawl }