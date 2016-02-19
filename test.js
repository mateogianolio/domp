(function () {
  'use strict';

  var domp = require('./domp');

  var urls = [
    'https://en.wikipedia.org/wiki/Web_scraping',
    'https://en.wikipedia.org/wiki/Web',
  ];

  function success(dom) {
    console.log([...dom.find('a')].map(a => [a.name, a.href]).slice(0, 10));
  }

  function error() {
    console.log('request fail');
  }

  for (var page of domp(urls))
    page.then(success, error);
}());
