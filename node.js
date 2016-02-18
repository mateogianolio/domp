(function () {
  'use strict';

  class Node {
    constructor(name, attribs) {
      this.name = name;
      this.children = [];
      for (var key in attribs)
        if (attribs.hasOwnProperty(key))
          this[key] = attribs[key];
    }

    [Symbol.iterator]() {
      return this.traverse(this);
    }

    get siblings() {
      var copy = this;
      return (function* () {
        if (!copy.parent)
          return;

        for (var child of copy.parent.children)
          if (copy.name !== child.name)
            yield child;
      }());
    }

    append(node) {
      node.parent = this;
      this.children.push(node);
    }

    map(f) {
      var copy = this;
      return (function* () {
        for (var node of copy)
          yield f(node);
      }());
    }

    filter(f) {
      var copy = this;
      return (function* () {
        for (var node of copy)
          if (f(node))
            yield node;
      }());
    }

    find(name) {
      return this.filter(node => node.name === name);
    }

    *traverse(node) {
      yield node;
      for (var child of node.children)
        yield *this.traverse(child);
    }
  }

  module.exports = Node;
}());
