(function () {
  'use strict';

  var domp = require('../domp');
  domp('https://en.wikipedia.org', function(dom) {
    console.log(...dom.map(node => node.name));
    // html head meta title script ...
  });
}());
