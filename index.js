const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');

const enviromentName = "dev"
app.use(morgan(enviromentName));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 5000

app.use('/crawl', require('./routes/crawl'));


var server=app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })


const shopeeCrawl = require('./crawl/shopee_crawl');
const tikiCrawl = require('./crawl/tiki_crawl');
const lazadaCrawl = require('./crawl/lazada_crawl');

try {
  shopeeCrawl.shopee_crawl();
  tikiCrawl.tiki_crawl();
  lazadaCrawl.lazada_crawl();
} catch(e) {
  console.log(e);
}



  module.exports = app;