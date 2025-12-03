# CompoundMap

Easily map unordered sets of arbitrary values to corresponding values!

## Install

```
> npm install @gershy/compound-map
```

## Example Usage
```
import CompoundMap from '@gershy/compound-map';

const cm = new CompoundMap({ width: 3 });
const key1 = {};
const key2 = [];
const key3 = /abc/i;

cm.set([ key1, key2, key3 ], 'lol');

console.log(cm.get([ key1, key2, key3 ])); // 'lol'
console.log(cm.get([ key3, key1, key2 ])); // 'lol'
console.log(cm.get([ key1, key2, {}   ])); // undefined
```

## Details

- Must provide `width` value to constructor indicating fixed compound-key size
- `CompoundMap` keys may be any arbitrary value
- `CompoundMap` values may be any arbitrary value