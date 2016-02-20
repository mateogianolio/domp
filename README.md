# domp

Scraping and DOM tree manipulation library for Node.js. Uses [htmlparser2](https://github.com/fb55/htmlparser2) for HTML parsing.

```bash
$ npm install domp
```

```javascript
var domp = require('domp');
```

### Usage

#### [Get single page (`examples/single.js`)](https://github.com/mateogianolio/domp/blob/master/examples/single.js)

```bash
$ node examples/single.js
```

```javascript
domp(url, function(dom) {
  console.log(...dom.map(node => node.name));
  // html head meta title script ...
});
```

#### [Get multiple pages (`examples/multiple.js`)](https://github.com/mateogianolio/domp/blob/master/examples/multiple.js)

You can scrape an `Array` of urls by

1. providing a callback:

  ```javascript
  domp(urls, function(dom) {
    // called twice
  })
  ```

2. looping through an iterator

  ```javascript
  for (var page of domp(urls))
    page.then(function (dom) {
      // resolved
    }, function (error) {
      // rejected
    });
  ```

#### [Crawling (`examples/crawl.js`)](https://github.com/mateogianolio/domp/blob/master/examples/crawl.js)

```javascript
function resolve(next) {
  return function (dom) {
    var title = dom.find('title').next().value,
        links = [...dom.filter(node => node.href && node.href.indexOf('http') === 0)];

    // get random link
    var link = links[Math.floor(Math.random() * links.length)];

    console.log(title.text);
    console.log(link.href);

    // submit link(s) to be scraped next
    next(link.href);
  };
}

domp.crawl('https://en.wikipedia.org', function(requests, next) {
  for (var request of requests)
    request.then(resolve(next));
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


### DOM Manipulation

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
