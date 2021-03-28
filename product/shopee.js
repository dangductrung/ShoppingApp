const cheerio = require('cheerio');
const isExist = require('../func/is_exist');
const saveProduct = require('../func/save_product');
const string_helper = require('../helper/string_helper');
var Product = require("../model/product");

const shopee_base_url = "https://shopee.vn";

const getProductInfo = async (html, link) => {
    const $ =  cheerio.load(html);

    const productName = $('div.attM6y > span').text();
    let productPrice = $('div._3e_UQT').text();
    const trademark = $('div.aPKXeO > a._3Qy6bH').text();
    productPrice = productPrice.split('-')[0]
    if(!string_helper.isEmpty(productPrice)) {
        if(!(await isExist.isExist(link))) {
            const object = {
                name: productName,
                current_price: productPrice.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "shopee"
            };
            await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
            return;
        } else {
            await Product.findAll({
                limit: 1,
                where: { 
                    link: link
                },
                order: [ [ 'created_at', 'DESC' ]]
            }).then(async function(entities) {
                if(entities.length > 0) {
                    if('' + entities[0].current_price !==  productPrice.match(/\d/g).join('')) {
                        const object = {
                            name: productName,
                            current_price: productPrice.match(/\d/g).join(''),
                            brand: trademark,
                            link: link,
                            from: "shopee"
                        };
                        await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
                    }
                }
            });
        }
    }
    crawlnext(shopee_base_url, html, 'shopee');
};

const crawlnext = (base_url, html, type) => {
    const crawl = require('../crawl/crawl');
    const crawler = require('../crawl/get_link');

    if(html == null) {
        return;
    }
    var links = crawler.getPageLink(html);
    links_filted = crawler.filterLink(base_url, links, type);
    for(i = 0; i<links_filted.length; ++i) {
        crawl.crawl(base_url, links_filted[i], type);
    }
};
module.exports = { getProductInfo }