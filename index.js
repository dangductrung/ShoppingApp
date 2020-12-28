const crawl = require('./crawl/get_link');

const url_target = "https://shopee.vn/"

crawl.getPageContent(url_target).then((res) => {
    var pageHTML = res.html()
    var links = crawl.getPageLink(pageHTML)
    links_filted = crawl.filterLink(url_target, links)
    return crawl.exportFile("data.json", JSON.stringify(links_filted))
});