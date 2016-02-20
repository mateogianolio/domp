(function () {
  'use strict';

  var domp = require('../domp'),
      url = 'https://en.wikipedia.org';

  function resolve(next) {
    return function (dom) {
      var title = dom.find('title').next().value,
          links = [...dom.filter(node => node.href && node.href.indexOf('/wiki/') === 0)],
          follow = [],
          r;

      for (var i = 0; follow.length < 3 && i < links.length; i++) {
        r = links[Math.floor(Math.random() * links.length)];
        if (!(r in follow))
          follow.push(url + r.href);
      }

      console.log(title.text);
      console.log(follow.join('\n'));
      console.log();

      next(follow);
    };
  }

  domp.crawl('https://en.wikipedia.org', function(requests, next) {
    for (var request of requests)
      request.then(resolve(next));
  });
}());
