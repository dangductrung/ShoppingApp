const schedule = require('node-schedule');
const tikiCrawl = require('../crawl/tiki_crawl');

const crawl = async () => {
    try {
        tikiCrawl.tiki_crawl();
      } catch(e) {
        console.log(e);
      }
      
    // const rule = new schedule.RecurrenceRule();
    // Sunday &  Wednesday
    // rule.dayOfWeek = [0, 3];
    // rule.hour = 0;
    // rule.minute = 0;

    // const job = schedule.scheduleJob(rule,async function(){
    //     try {
    //          shopeeCrawl.shopee_crawl();
    //          tikiCrawl.tiki_crawl();
    //          lazadaCrawl.lazada_crawl();
    //       } catch(e) {
    //         console.log(e);
    //       }
    //   });  
};


module.exports = { crawl }