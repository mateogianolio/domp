(function () {
  'use strict';

  var domp = require('../domp'),
      url = 'https://en.wikipedia.org';

  function resolve(next) {
    return function (dom) {
      var title = dom.find('title').next().value,
          links = [...dom.filter(node => node.href && node.href.indexOf('/wiki/') === 0)];

      var link = links[Math.floor(Math.random() * links.length)];

      console.log(title.text);
      console.log(link.href);
      console.log();

      next(url + link.href);
    };
  }

  domp.crawl('https://en.wikipedia.org', function(requests, next) {
    for (var request of requests)
      request.then(resolve(next));
  });
}());
