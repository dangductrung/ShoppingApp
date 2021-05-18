const Product = require('../model/product');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
var shell = require('shelljs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
puppeteer.use(RecaptchaPlugin()).use(StealthPlugin())
process.setMaxListeners(Infinity);

const crawl = async () => {
    const listProduct = await Product.findAll({
        where: {
            image: null
        }
    });

    for(i = 0 ; i < listProduct.length; ++i) {
        await openBrowser(listProduct[i].from, listProduct[i].link, listProduct[i].id);
    }

    console.log(listProduct.length)
};

async function autoScroll(page) {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 600;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const openBrowser = async (type, link, prdId) => {
    const browser = await puppeteer.launch({
        // headless: false,
        ignoreHTTPSErrors: true,
        args: ['--start-fullscreen', 
        '--enable-blink-features=HTMLImports', 
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        "--memory=1024MB", 
        '--unlimited-storage', 
        '--full-memory-crash-report',
        '--disable-dev-shm-usage',
        '--disable-gpu'],
        defaultViewport: null,
        read_timeout: 60000,
        handleSIGINT : false,
        timeout: 30000,
        userDataDir: '${__dirname}/profile-dir'
    });

    try {
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(link, { waitUntil: 'networkidle0' , timeout: 30000});
        
        page.on('pageerror',async (err) => {
            await browser.close();
        });
        page.on('timeout',async (err) => {
            await browser.close();
        });
        // await autoScroll(page);
        let content = await page.evaluate(() => document.querySelector('*').outerHTML);

        await solveContent(content, type, prdId);
        await page.close();
        await browser.close();
    }catch(err) {
        console.log("Puppeteer error: " , err);
        shell.exec('pkill Chromium');
        await openBrowser(type, link);
    }finally {
        await browser.close();
    }
}

const solveContent = async (content,type, prdId) => {
    const $ =  cheerio.load(content);

    const product = await Product.findOne({
        where: {
            id: prdId
        }
    });

    let imageLink = "";

    if(type === "shopee") {
        $('div._1cILQR').map((i, element) => {
            if (!$(element).html().includes('svg') && imageLink === "") {
                imageLink = $(element).html();
            }
        });

        const firstIndex = imageLink.indexOf("&quot;");
        const lastIndex = imageLink.lastIndexOf("&quot;");
        imageLink = imageLink.substring(
            firstIndex + 6, 
            lastIndex
        );
    } else if(type === "lazada") {
        imageLink = $('img.pdp-mod-common-image').attr('src');
        if(!imageLink.includes("https:")) {
            imageLink = "https:" + imageLink;
        }
    } else if(type === "tiki") {
        imageLink = $('div.PictureV2__StyledWrapImage-tfuu67-0 > img').attr('src');
    }

    product.image = imageLink;
    await product.save();

    return;
};


module.exports = { crawl }