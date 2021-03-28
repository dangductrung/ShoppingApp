const cheerio = require('cheerio');
const isExist = require('../func/is_exist');
const saveProduct = require('../func/save_product');
const string_helper = require('../helper/string_helper');
var Product = require("../model/product");

const lazada_base_url = "https://lazada.vn";

 const getProductInfo = async (html, link) => {
    const $ = cheerio.load(html);

    const productName = $('h1.pdp-mod-product-badge-title').text();
    const productPrice = $('span.pdp-price_type_normal').text();
    const trademark = $('a.pdp-product-brand__brand-link').text();


    if(!string_helper.isEmpty(productName)) {
        if(!(await isExist.isExist(link))) {
            const object = {
                name: productName,
                current_price: productPrice.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "lazada"
            };
            await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
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
                            from: "lazada"
                        };
                        await saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from );
                    }
                }
            });
        }
    }
     crawlnext(lazada_base_url, html, 'lazada');
};

const crawlnext = async (base_url, html, type) => {
    const crawl = require('../crawl/crawl');
    const crawler = require('../crawl/get_link');

    if(html == null) {
        return;
    }
    var links = crawler.getPageLink(html);
    links_filted = crawler.filterLink(base_url, links, type);


    for(i = 0; i<links_filted.length; ++i) {
        // await new Promise(resolve => setTimeout(resolve, 5000));
        crawl.crawl(base_url, links_filted[i], type);
    }
};

module.exports = { getProductInfo }