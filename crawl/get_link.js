const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs');
const shopee = require('../product/shopee');
const tiki = require('../product/tiki');
const lazada = require('../product/lazada');
const isExist = require('../func/is_exist');

puppeteer.use(RecaptchaPlugin()).use(StealthPlugin())
process.setMaxListeners(Infinity);

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

const crawlnext = async (base_url, html, type) => {
    const crawl = require('../crawl/crawl');
    const crawler = require('../crawl/get_link');

    if(html == null) {
        return;
    }
    var links = crawler.getPageLink(html);
    links_filted = crawler.filterLink(base_url, links, type);
    console.log("------------CREATE NEW------------");
    await crawl.crawl(base_url,links_filted, type);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function get page content
const getPageContent = async(uri, type) => {
    var uri_links = [];
    if(Array.isArray(uri)) {
        for(i = 0; i<uri.length; ++i) {
            let link = uri[i];
            if(link !== undefined && link !== "undefined" && !(isLinkCrawled(type + ".txt", link)) ) {
                uri_links.push(link);
            }
        }
    } else {
        uri_links.push(uri);
    }
    if(uri_links.length == 0) {
        return;
    }
    
    try {
        for(index = 0;index<uri_links.length; ++index) {
            let link = uri_links[index].replace(' ', "%");
            exportFile(type + ".txt", link);
            await openBrowser(type,link);
        }
        return;
    } catch(e) {
        // console.log("Puppeteer error: " , e);
        getPageContent(uri, type);
    }
    return null;
};

const openBrowser = async (type, link) => {
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

        if(!await isExist.isExist(link)) {
            await autoScroll(page);
        }
        let content = await page.evaluate(() => document.querySelector('*').outerHTML);
        await page.close();
        await browser.close();
        await solveContent(content, type, link);
    }catch(err) {
        console.log("Puppeteer error: " , err);
        await browser.close();
    }finally {
        await browser.close();
    }
}

const solveContent = async (content,type, link) => {
    if(type === "shopee") {
        await shopee.getProductInfo(content, link);
    } else if(type === "lazada") {
        await lazada.getProductInfo(content, link);
    } else if(type === "tiki") {
        await tiki.getProductInfo(content, link);
    }
    return;
};

// function get all link on page
const getPageLink = (html) => {
    const $ = cheerio.load(html);
    var tags = $('a');
    var links = [];
    $(tags).each((_index, link) => {
        links.push($(link).attr('href'));
    });

    return links;
};

// function filter link beautiful
const filterLink = (base_url, links, type) => {
    links.forEach((link, _index) => {
        if (link == undefined || link == "undefined" ||
            link == "javascript:void(0)" ||
            link.includes("login") || link.includes(":") || link.includes("#") ||
            link.includes("cart") || link.includes("about") || 
            link.includes("notification") || link.includes("searchbox") || 
            link.includes("logout") || link == null || isLinkCrawled(type + ".txt", link) || link.includes('tka.tiki.vn') || link.includes("bit.ly") ||
            link.includes("register")) {
            delete links[_index];
            return;
        }

        var temp = "";
        if(link.includes("https://pages.lazada.vn")) {
           temp = link;
        } else if (link.includes("www.lazada.vn/products") || link.includes("pages.lazada.vn")  ) {
            temp = "https:" + link;
        } else {
            temp = base_url + link;
        } 

        if(type === 'lazada' && temp.includes("clickTrackInfo=")) {
            let index = temp.indexOf("clickTrackInfo=");
            temp = temp.replace(temp.substring(index, temp.length), "");
        }

        if(!isLinkCrawled(type + ".txt", temp)) {
            links[_index] = temp;
        } else {
            delete links[_index];
        }
        return;
    });
    links = links.filter(function(elem, pos) {
        return links.indexOf(elem) == pos;
    })
    return links;
};

const exportFile = (file_export, data) => {
    fs.appendFileSync( __dirname + "/links/" +  file_export, "," + data);
    console.log('Saved: ' ,data);
};

const isLinkCrawled = (file_export, searchString) => {
    let data = fs.readFileSync( __dirname + "/links/" + file_export);
    if(data.indexOf(searchString) >= 0) {
        return true;
    }
    return false;
};

module.exports = { getPageContent, getPageLink, filterLink, crawlnext }