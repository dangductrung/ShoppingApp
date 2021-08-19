const schedule = require('node-schedule');
const crawler = require('../crawl/get_link');
const Product = require('../model/product');

const crawl = async () => {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0,1,2,3,4,5,6];
    rule.hour = 0;
    rule.minute = 0;

    const job = schedule.scheduleJob(rule,async function(){
        try {
            const products = await Product.findAll();
            for(i = 0;i<products.length ; ++i) {
                await crawler.getPageContent(products[i].link, products[i].from, false);
            }
        } catch(e) {
            console.log(e);
        }
    }); 
};

module.exports = { crawl }