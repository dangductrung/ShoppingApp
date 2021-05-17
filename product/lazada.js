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
    let imageLink = $('img.pdp-mod-common-image').attr('src');

    if(!imageLink.includes("https:")) {
        imageLink = "https:" + imageLink;
    }

    if(!string_helper.isEmpty(productName)) {
        if(!(await isExist.isExist(link))) {
            const object = {
                name: productName,
                current_price: productPrice.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "lazada",
                image: imageLink
            };
            saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from, object.image ).then(async () => {
                const crawler = require('../crawl/get_link');
                await crawler.crawlnext(lazada_base_url, html, 'lazada');
            });
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
                            from: "lazada",
                            image: imageLink
                        };
                        saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from, object.image ).then(async () => {
                            const crawler = require('../crawl/get_link');
                            await crawler.crawlnext(lazada_base_url, html, 'lazada');
                        });
                        return;
                    }
                }
            });
        }
    } else {
        const crawler = require('../crawl/get_link');
        await crawler.crawlnext(lazada_base_url, html, 'lazada');
    }
};


module.exports = { getProductInfo }