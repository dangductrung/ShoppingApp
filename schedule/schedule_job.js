const schedule = require('node-schedule');
const shopeeCrawl = require('../crawl/shopee_crawl');
const tikiCrawl = require('../crawl/tiki_crawl');
const lazadaCrawl = require('../crawl/lazada_crawl');

const crawl = () => {
    try {
        shopeeCrawl.shopee_crawl();
        tikiCrawl.tiki_crawl();
        lazadaCrawl.lazada_crawl();
      } catch(e) {
        console.log(e);
      }
      
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = 3;
    rule.hour = 3;
    rule.minute = 53;

    const job = schedule.scheduleJob(rule,async function(){
        try {
             shopeeCrawl.shopee_crawl();
             tikiCrawl.tiki_crawl();
             lazadaCrawl.lazada_crawl();
          } catch(e) {
            console.log(e);
          }
      });  
};


module.exports = { crawl }