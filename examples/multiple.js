(function () {
  'use strict';

  var domp = require('../domp');

  var urls = [
    'https://en.wikipedia.org',
    'https://de.wikipedia.org/'
  ];

  // #1
  domp(urls, function(dom) {
    console.log(...dom.map(node => node.name));
    console.log();
    // html head meta title script ...
  });

  // #2
  for (var request of domp(urls))
    request.then(function () {
      // resolved
    });
}());
