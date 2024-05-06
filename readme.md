# CompoundMap

Makes it easy to map an unordered set of arbitrary values to a value!

```
let cm = new CompoundMap({ width: 3 });
let key1 = {};
let key2 = [];
let key3 = /abc/i;

cm.set([ key1, key2, key3 ], 'lol');

console.log(cm.get([ key1, key2, key3 ])); // lol
console.log(cm.get([ key3, key1, key2 ])); // lol
console.log(cm.get([ key1, key2, key2 ])); // undefined
```