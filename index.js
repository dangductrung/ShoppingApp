const crawl = require('./crawl/get_link');
const url_target = "https://shopee.vn/"

crawl.getPageContent(url_target).then((res) => {
    var pageHTML = res;
    var links = crawl.getPageLink(pageHTML);
    links_filted = crawl.filterLink("https://shopee.vn", links);
    return crawl.exportFile("data.json", JSON.stringify(links_filted));
});