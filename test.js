(function () {
  'use strict';

  var domp = require('./domp'),
      url = 'https://en.wikipedia.org/wiki/Web_scraping';

  domp(url, function(error, dom) {
    if (error)
      throw error;

    console.log(...dom.map(node => node.name));
  });
}());
