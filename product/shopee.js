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
    productPrice = productPrice.split('-')[0];
    let imageLink = "";
    $('div._1cILQR').map((i, element) => {
        if (!$(element).html().includes('svg') && imageLink === "") {
            imageLink = $(element).html();
        }
    });

    if(imageLink != undefined && imageLink != null) {
        const firstIndex = imageLink.indexOf("&quot;");
        const lastIndex = imageLink.lastIndexOf("&quot;");
        imageLink = imageLink.substring(
            firstIndex + 6, 
            lastIndex
        );
    }

    if(!string_helper.isEmpty(productPrice)) {
        if(!(await isExist.isExist(link))) {
            const object = {
                name: productName,
                current_price: productPrice.match(/\d/g).join(''),
                brand: trademark,
                link: link,
                from: "shopee",
                image: imageLink
            };
            saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from, object.image ).then(async () => {
                const crawler = require('../crawl/get_link');
                await crawler.crawlnext(shopee_base_url, html, 'shopee');
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
                            from: "shopee",
                            image: imageLink
                        };
                        saveProduct.saveProduct(object.name, object.current_price, object.brand, object.link, object.from, object.image ).then(async () => {
                            const crawler = require('../crawl/get_link');
                            await crawler.crawlnext(shopee_base_url, html, 'shopee');
                        });
                        return;
                    }
                }
            });
        }
    } else {
        const crawler = require('../crawl/get_link');
        await crawler.crawlnext(shopee_base_url, html, 'shopee');
    }
};

module.exports = { getProductInfo }