'use strict';
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
class CompoundMap {
    constructor({ entries = [], width = entries[0][0].length } = {}) {
        if ((typeof width) !== 'number')
            throw Error('Width required');
        this.width = width;
        this.map = new Map();
        for (let [k, v] of entries)
            this.set(k, v);
    }
    set(cmpKey, val) {
        if (cmpKey.length !== this.width)
            throw Error(`Key must have size ${this.width}`);
        let map = this.map;
        let key = _a.getKey(cmpKey);
        let last = key.pop();
        for (let k of key) {
            if (!map.has(k))
                map.set(k, new Map());
            map = map.get(k);
        }
        let isOverwrite = map.has(last);
        map.set(last, val);
        if (!isOverwrite)
            _a.refInc(cmpKey);
        return this;
    }
    get(cmpKey) {
        if (cmpKey.length !== this.width)
            throw Error(`Key must have size ${this.width}`);
        let map = this.map;
        let key = _a.getKey(cmpKey);
        let last = key.pop();
        for (let k of key) {
            if (!map.has(k))
                return undefined;
            map = map.get(k);
        }
        return map.get(last);
    }
    has(cmpKey) {
        if (cmpKey.length !== this.width)
            throw Error(`Key must have size ${this.width}`);
        let map = this.map;
        let key = _a.getKey(cmpKey);
        let last = key.pop();
        for (let k of key) {
            if (!map.has(k))
                return false;
            map = map.get(k);
        }
        return map.has(last);
    }
    delete(cmpKey) {
        if (cmpKey.length !== this.width)
            throw Error(`Key must have size ${this.width}`);
        let arr = [];
        let map = this.map;
        let key = _a.getKey(cmpKey);
        let last = key.pop();
        for (let k of key) {
            if (!map.has(k))
                return false;
            arr.push({ map, k });
            map = map.get(k);
        }
        if (!map.has(last))
            return false;
        map.delete(last);
        for (let { map, k } of arr.reverse()) {
            if (map.get(k).size === 0)
                map.delete(k);
            else
                break;
        }
        _a.refDec(cmpKey);
        return true;
    }
}
_a = CompoundMap;
CompoundMap.cnt = 0;
CompoundMap.map = new WeakMap();
CompoundMap.isPrimitive = v => v == null || 'boo,str,num,big,sym'.includes((typeof v).slice(0, 3));
CompoundMap.uniqueStr = val => {
    let t = (typeof val).slice(0, 3);
    if (_a.isPrimitive(val))
        return `${t.slice(0, 3)}:${val}`;
    let entry = _a.map.get(val);
    if (!entry)
        _a.map.set(val, entry = { refs: 0, str: (_a.cnt++).toString(36) });
    return entry.str;
};
CompoundMap.getKey = cmpKey => cmpKey.map(k => _a.uniqueStr(k)).sort();
CompoundMap.refInc = cmpKey => {
    for (let k of cmpKey.filter(k => !_a.isPrimitive(k))) {
        let ent = _a.map.get(k);
        ent.refs++;
    }
};
CompoundMap.refDec = cmpKey => {
    for (let k of cmpKey.filter(k => !_a.isPrimitive(k))) {
        let ent = _a.map.get(k);
        ent.refs--;
        if (ent.refs <= 0)
            _a.map.delete(k);
    }
};
exports.default = CompoundMap;
//# sourceMappingURL=main.js.map