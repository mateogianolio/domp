(function () {
  'use strict';

  var request = require('request');
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
      request(url, function (error, response, body) {
        if (error || response.statusCode !== 200)
          return reject();
        resolve(parse(body));
      });
    });
  }

  module.exports = function (urls, callback) {
    if (typeof urls === 'string') {
      get(urls).then(dom => callback(dom));
      return;
    }

    return (function* () {
      for (var url of urls)
        yield get(url);
    }());
  };
}());
