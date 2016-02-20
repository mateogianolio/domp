# domp

Scraping and DOM tree manipulation library for Node.js. Uses [htmlparser2](https://github.com/fb55/htmlparser2) for HTML parsing.

```bash
$ npm install domp
```

```javascript
var domp = require('domp');
```

### Usage

#### [Get single page](https://github.com/mateogianolio/domp/blob/master/examples/single.js)

```javascript
domp(url, function(dom) {
  console.log(...dom.map(node => node.name));
  // html head meta title script ...
});
```

#### [Get multiple pages](https://github.com/mateogianolio/domp/blob/master/examples/multiple.js)

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

#### [Crawling](https://github.com/mateogianolio/domp/blob/master/examples/crawl.js)

```javascript
// detect valid urls
function validate(node) {
  return
    node.name === 'a' &&
    node.href &&
    node.href.indexOf('http') === 0;
}

// careful, will crawl everything (url can be one or several urls)
domp.crawl(url, function (pages, next) {
  // pages is an iterator of promises
  for (var page of pages)
    page.then(function (dom) {
      // submit new urls to crawl to the next() function
      var links = [...dom.filter(validate)].map(node => node.href);
      next(links);
    });
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
