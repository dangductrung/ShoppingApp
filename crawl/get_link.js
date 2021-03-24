const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs');

puppeteer.use(RecaptchaPlugin()).use(StealthPlugin())
process.setMaxListeners(Infinity);

async function autoScroll(page) {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 400;
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

// function get page content
const getPageContent = async(uri, type) => {
    if(uri == undefined || uri == "undefined" ) {
        return null
    }

    if( await isLinkCrawled(type + ".txt", uri)) {
        return null;
    }

    console.log("Crawl: ", uri);

    try {
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
            read_timeout: 30000,
            handleSIGINT : false,
        });

        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);
    
        await page.goto(uri, { waitUntil: 'networkidle0' , timeout: 0});
    
        await new Promise(resolve => setTimeout(resolve, 3000));
    
        await autoScroll(page);
        const content = await page.evaluate(() => document.querySelector('*').outerHTML);
        await browser.close();

        await exportFile(type + ".txt", uri);


        return content;
    } catch(e) {
        console.log("Puppeteer error: " , e);
    }
    return null;

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
            link.includes("cart") || link.includes("about") || link.includes("//") || 
            link.includes("notification") || link.includes("searchbox") || 
            link.includes("logout") || link == null ||
            link.includes("register")) {
            delete links[_index];
            return;
        }

        var _regex = new RegExp("https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}|\/$/g")

        if (!_regex.test(link)) {
            links[_index] = base_url + link;
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

const exportFile = async (file_export, data) => {
    fs.appendFileSync( __dirname + "/links/" +  file_export, "," + data);
    console.log('Saved: ' ,data);
};

const isLinkCrawled = async (file_export, searchString) => {
    let data = fs.readFileSync( __dirname + "/links/" + file_export);
    if(data.indexOf(searchString) >= 0) {
        return true;
    }
    return false;
};

module.exports = { getPageContent, getPageLink, filterLink }