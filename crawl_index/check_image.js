const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const schedule = require('../schedule/check_image_schedule');

require('events').EventEmitter.prototype._maxListeners = 100;

const enviromentName = "dev"
app.use(morgan(enviromentName));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
var server=app.listen(4005, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  schedule.crawl();

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  
  module.exports = app;