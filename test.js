(function () {
  'use strict';

  var domp = require('./domp'),
      url = 'https://en.wikipedia.org/wiki/Web_scraping';

  function link(node) {
    return node.name === 'a' &&
           node.href &&
           node.href.indexOf('http') === 0;
  }

  // careful, will crawl everything
  domp.crawl(url, function (pages, next) {
    // pages is iterator of promises
    for (var page of pages)
      page.then(function (dom) {
        // submit new urls to crawl to the next() function
        var links = [...dom.filter(link)].map(node => node.href);
        next(links);
      });
  });
}());
