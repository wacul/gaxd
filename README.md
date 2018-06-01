# gaxd

Google analytics cross domain settings utilities

## source

### initialization

```html
<script src="/path/to/gaxd.js"></script>
or
<script src="/path/to/gaxd.source.js"></script>
```

### setup

Load universal analytics and setup ga("create", ...) then:

```js
// for redirect
gaxd.source.redirect({
  origins: ["https://destination.com"]
})

// for iframe
gaxd.source.iframe({
  selector: "#iframe-form",
  destinationOrigin: "https://destination.com"
});
```

## destination

### initialization

```html
<script src="/path/to/gaxd.js"></script>
or
<script src="/path/to/gaxd.destination.js"></script>
```

### setup


Load universal analytics then:

```js
gaxd.destination({
  trackingId: "UA-XXXXXX-X",
  sourceOrigin: "https://source.com"
}).then(ga => {
  ga("send", "pageview");
});
```