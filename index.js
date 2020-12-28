const crawl = require('./crawl/get_link');
const cheerio = require('cheerio')
const url_target = "https://shopee.vn/"
const product_target = "https://shopee.vn/-SALE-20-Nutrex-Outlift-Th%E1%BB%B1c-Ph%E1%BA%A9m-B%E1%BB%95-Sung-S%E1%BB%A9c-M%E1%BA%A1nh-(20-L%E1%BA%A7n-D%C3%B9ng)-H%C3%A0ng-Ch%C3%ADnh-H%C3%A3ng-i.119902685.5465367169";

var phantom = require('phantom');


(async function(req, res) {

    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.on('onConsoleMessage', function(msg) {
        console.info(msg);
    });
    await page.on('onError', function(msg) {
        console.info(msg);
    });

    const status = await page.open(product_target);
    await console.log('STATUS:', status);

    // Wait a bit for javascript to load and run
    await new Promise(resolve => setTimeout(resolve, 3000))

    await page.includeJs('https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');
    await page.evaluate(function() {
        console.log($('div._2TJgvU > div.qaNIZv > span').text())
    });

    await instance.exit();
})();