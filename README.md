# gaxd

Google analytics cross domain utilities

## source

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

Load universal analytics then:

```js
gaxd.destination({
  trackingId: "UA-XXXXXX-X",
  sourceOrigin: "https://source.com"
}).then(ga => {
  ga("send", "pageview");
});
```