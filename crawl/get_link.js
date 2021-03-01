const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function autoScroll(page) {
    await page.evaluate(async() => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
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
const getPageContent = async(uri) => {
    const browser = await puppeteer.launch({
        args: ['--start-fullscreen', '--enable-blink-features=HTMLImports'],
        defaultViewport: null,
    });
    const page = await browser.newPage();


    await page.goto(uri, { waitUntil: 'networkidle2' });

    await new Promise(resolve => setTimeout(resolve, 3000));

    await autoScroll(page);
    const content = await page.evaluate(() => document.querySelector('*').outerHTML);
    await browser.close();

    return content;
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
const filterLink = (url_target, links) => {
    links.forEach((link, _index) => {

        if (link == undefined ||
            link == "javascript:void(0)" ||
            link.includes("login") ||
            link.includes("logout") ||
            link.includes("register")) {
            delete links[_index];
            return;
        }

        var _regex = new RegExp("https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}")

        if (!_regex.test(link)) {
            links[_index] = url_target + link;
        }

        return;
    });

    var links = links.filter(function(link) {
        return link != null;
    });

    return links;
};


const exportFile = (file_export, data) => {
    fs.writeFile(file_export, data, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
};

module.exports = { exportFile, getPageContent, getPageLink, filterLink }