const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const isExist = require('../func/is_exist');
const crawledLink = require('../model/crawled');

async function autoScroll(page) {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
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

    let link = await crawledLink.findOne(
        {
            where: {
                link: uri,
                source: type
            }
        }
    );

    if(link instanceof crawledLink) {
        return null;
    }

    console.log("Crawl: ", uri);

    try {
        const browser = await puppeteer.launch({
            args: ['--start-fullscreen', '--enable-blink-features=HTMLImports', '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null,
        });
    
        const page = await browser.newPage();
    
    
        await page.goto(uri, { waitUntil: 'networkidle2' });
    
        await new Promise(resolve => setTimeout(resolve, 3000));
    
        await autoScroll(page);
        const content = await page.evaluate(() => document.querySelector('*').outerHTML);
        await browser.close();
        await crawledLink.create({
            link: uri,
            source: type
        });
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
            link.includes("=") || link.includes("cart") || link.includes("about") || 
            link.includes("notification") || link.includes("searchbox") || link.includes("//") ||
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

    exportFile('data.json', links);

    return links;
};


const exportFile = (file_export, data) => {
    fs.writeFileSync(file_export, data, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
};

module.exports = { exportFile, getPageContent, getPageLink, filterLink }