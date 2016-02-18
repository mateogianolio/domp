(function () {
  'use strict';

  var Node = require('./node'),
      Parser = require('htmlparser2').Parser;

  module.exports = function (url, callback) {
    require('request')(url, function (error, response, body) {
      if (error)
        return callback(error);

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

      callback(null, dom);
    });
  };
}());
