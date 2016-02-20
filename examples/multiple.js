(function () {
  'use strict';

  var domp = require('../domp');

  domp(['https://en.wikipedia.org', 'https://de.wikipedia.org/'], function(dom) {
    console.log(...dom.map(node => node.name));
    console.log();
    // html head meta title script ...
  });
}());
