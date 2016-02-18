# domp

Scraping and DOM tree manipulation library for Node.js. Uses [htmlparser2](https://github.com/fb55/htmlparser2) for HTML parsing.

```bash
$ npm install domp
```

### Usage

```javascript
var domp = require('domp'),
    url = 'https://en.wikipedia.org/wiki/Web_scraping';

domp(url, function(error, dom) {
  if (error)
    throw error;

  console.log(...dom.map(node => node.name));
  // html head meta title script ...
});
```

### Traversal

Standard traversal using `for ... of`:

```javascript
for (var node of dom)
  console.log(node);
```

Sibling (children with same parent) traversal using `for ... of`:

```javascript
for (var sibling of node.siblings)
  console.log(sibling);
```

Tag name traversal using `for ... of` and `find(name)`:

```javascript
for (var node of dom.find('p'))
  console.log(node);
```


### Manipulation


#### Mapping

DOM nodes (see `node.js`) implement mapping similar to what we're used to from `Array.prototype.map`, but instead of returning an `Array` it returns an `Iterable`. The `Iterable` can either be unpacked into an `Array` using the spread operator (`...`) or be used as a normal iterator.

```javascript
var names = dom.map(node => node.name);

names = [...names];
// names = ['html', 'head', 'meta', 'title', ...]

for (var name of names)
  console.log(name);
// html
// head
// ...
```


#### Filtering

Filtering works pretty much the same (returns `Iterable`):

```javascript
// get all 'p' tags
var paragraphs = dom.filter(node => node.name === 'p');

// traverse
for (var p of paragraphs)
  console.log(p);
```

There's also the short `find(name)` that can be used to find tag names in the tree:

```javascript
for (var node in dom.find('p'))
  console.log(node);
```
