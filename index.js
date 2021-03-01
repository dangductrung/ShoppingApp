const crawl = require('./crawl/get_link');
const shopee = require('./shopee/shopee');
const tiki = require('./tiki/tiki');
const lazada = require('./lazada/lazada');
const shopee_target = "https://shopee.vn/-CH%C3%8DNH-H%C3%83NG-B%C3%8CNH-N%C3%93NG-L%E1%BA%A0NH-ROSSI-AMORE-20-LIT-RA-20SQ-CH%C3%8DNH-H%C3%83NG-B%E1%BA%A2O-H%C3%80NH-7-N%C4%82M-i.35014259.6762374918";
const tiki_target = "https://tiki.vn/may-nuoc-nong-ariston-an2-30-rs-2-5-fe-mt-2500w-p5978889.html?spid=5978891&src=deal-hot";
const lazada_target = "https://www.lazada.vn/products/may-nuoc-nong-ariston-truc-tiep-rmc45pe-vn-4500w-cau-dao-chong-ro-dien-elcb-bo-on-dinh-nhiet-kep-he-thong-chong-bong-thong-minh-vo-chong-tham-nuoc-ip25-he-thong-an-toan-dong-bo-i995926831-s3199410438.html?spm=a2o4n.searchlist.list.2.57222d44ZtDmiy&search=1";

crawl.getPageContent(tiki_target).then(async(res) => {
    // shopee.getProductInfo(res);
    tiki.getProductInfo(res);
    // lazada.getProductInfo(res);
    var pageHTML = res;
    var links = crawl.getPageLink(pageHTML);
    links_filted = crawl.filterLink("https://shopee.vn", links);
    return crawl.exportFile("data.json", JSON.stringify(links_filted));
});