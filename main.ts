'use strict';

type CompoundKey = any[];

export default class CompoundMap<K extends CompoundKey, V> {
  
  static cnt = 0;
  static map = new WeakMap();
  static isPrimitive = v => v == null || 'boo,str,num,big,sym'.includes((typeof v).slice(0, 3));
  static uniqueStr = val => {
    
    let t = (typeof val).slice(0, 3);
    if (this.isPrimitive(val)) return `${t.slice(0, 3)}:${val}`;
    
    let entry = this.map.get(val);
    if (!entry) this.map.set(val, entry = { refs: 0, str: (this.cnt++).toString(36) });
    return entry.str;
    
  };
  static getKey = cmpKey => cmpKey.map(k => this.uniqueStr(k)).sort();
  static refInc = cmpKey => {
    for (let k of cmpKey.filter(k => !this.isPrimitive(k))) {
      let ent = this.map.get(k);
      ent.refs++;
    }
  };
  static refDec = cmpKey => {
    for (let k of cmpKey.filter(k => !this.isPrimitive(k))) {
      let ent = this.map.get(k);
      ent.refs--;
      if (ent.refs <= 0) this.map.delete(k);
    }
  };
  
  private width: number;
  private map: Map<string, any>;
  
  constructor({ entries=[] as [K, V][], width=entries[0][0].length }={}) {
    
    if ((typeof width) !== 'number') throw Error('Width required');
    
    this.width = width as number;
    this.map = new Map();
    
    for (let [ k, v ] of entries) this.set(k, v);
    
  }
  
  set(cmpKey: K, val: V): CompoundMap<K, V> {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    let map = this.map;
    let key = CompoundMap.getKey(cmpKey);
    let last = key.pop();
    
    for (let k of key) {
      if (!map.has(k)) map.set(k, new Map());
      map = map.get(k);
    }
    
    let isOverwrite = map.has(last);
    
    map.set(last, val);
    if (!isOverwrite) CompoundMap.refInc(cmpKey);
    
    return this;
    
  }
  
  get(cmpKey: K): undefined | V {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    let map = this.map;
    let key = CompoundMap.getKey(cmpKey);
    let last = key.pop();
    
    for (let k of key) {
      
      if (!map.has(k)) return undefined;
      map = map.get(k);
      
    }
    
    return map.get(last);
    
  }
  
  has(cmpKey: K): boolean {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    let map = this.map;
    let key = CompoundMap.getKey(cmpKey);
    let last = key.pop();
    
    for (let k of key) {
      
      if (!map.has(k)) return false;
      map = map.get(k) as Map<string, any>;
      
    }
    
    return map.has(last);
    
  }
  
  delete(cmpKey: K): boolean {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    let arr: { map: Map<string, any>, k: string }[] = [];
    let map = this.map;
    let key = CompoundMap.getKey(cmpKey);
    let last = key.pop();
    
    for (let k of key) {
      if (!map.has(k)) return false;
      arr.push({ map, k });
      map = map.get(k);
    }
    
    if (!map.has(last)) return false;
    
    // Delete, and do recursive cleanup
    map.delete(last);
    for (let { map, k } of arr.reverse()) {
      if (map.get(k).size === 0) map.delete(k);
      else                       break;
    }
    
    CompoundMap.refDec(cmpKey);
    
    return true;
    
  }
  
}