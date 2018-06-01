export function expose(name : string, value : any) {
  if (typeof window !== "undefined") {
    _expose(window, name.split("."), value);
  }

  function _expose(o : any, layers : string[], value : any) {
    if (layers.length === 1) {
      o[layers[0]] = value;
      return;
    }
    const [first,
      ...rest] = layers;
    if (o[first] == null) {
      o[first] = {};
    }
    _expose(o[first], rest, value);
  }
}