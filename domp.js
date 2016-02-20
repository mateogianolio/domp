(function () {
  'use strict';

  var request = require('request'),
      robots = require('robots-txt')();

  var Node = require('./node'),
      Parser = require('htmlparser2').Parser;

  function parse(body) {
    var dom;
    var parser = new Parser({
      onopentag: function (name, attribs) {
        if (!dom) {
          dom = new Node(name, attribs);
          return;
        }

        var node = new Node(name, attribs);
        dom.append(node);
        dom = node;
      },
      ontext: function (text) {
        if (dom)
          dom.text = dom.text ? (dom.text + text) : text;
      },
      onclosetag: function (name) {
        dom = dom.parent ? dom.parent : dom;
      }
    });

    parser.write(body);
    parser.end();

    return dom;
  }

  function get(url) {
    return new Promise(function (resolve, reject) {
      robots
        .isAllowed('domp', url)
        .then(function (allowed) {
          if (!allowed)
            return;

          request(url, function (error, response, body) {
            if (error || response.statusCode !== 200)
              return reject(error);
            resolve(parse(body));
          });
        });
    });
  }

  function iterate(urls) {
    return (function* () {
      for (var url of urls)
        yield get(url);
    }());
  }

  module.exports = function (urls, callback) {
    urls = typeof urls === 'string' ? [urls] : urls;
    if (!callback)
      return iterate(urls);

    for (var page of iterate(urls))
      page.then(callback);
  };

  function crawl(url, callback) {
    url = typeof url === 'string' ? [url] : url;
    callback(iterate(url), function (urls) {
      if (urls && urls.length)
        crawl(urls, callback);
    });
  }

  module.exports.crawl = crawl;
}());
