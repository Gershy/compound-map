'use strict';

type MinArray<T> = [ T, T, ...T[] ];
export type CompoundMapArgs<K extends MinArray<any>, V> = {}
  & { width?: number, entries?: [ K, V ][] }
  & ({ width: unknown } | { entries: unknown });
export default class CompoundMap<K extends MinArray<any>, V> {
  
  static cnt = 0;
  static map = new WeakMap<any, { refs: number, str: string }>();
  static isPrimitive = (v: any) => v == null || 'boo,str,num,big'.includes((typeof v).slice(0, 3));
  static uniqueStr = val => {
    
    if (this.isPrimitive(val)) return `${(typeof val).slice(0, 3)}:${val}`;
    
    const entry = this.map.get(val) ?? { refs: 0, str: (this.cnt++).toString(36) };
    if (entry.refs === 0) this.map.set(val, entry);
    return entry.str;
    
  };
  static getKey = (cmpKey: any[]) => cmpKey.map(k => this.uniqueStr(k)).sort();
  static refInc = (cmpKey: any[]) => {
    for (const k of cmpKey) {
      if (this.isPrimitive(k)) continue;
      const ent = this.map.get(k)!;
      ent.refs++;
    }
  };
  static refDec = (cmpKey: any[]) => {
    for (const k of cmpKey) {
      if (this.isPrimitive(k)) continue;
      const ent = this.map.get(k)!;
      ent.refs--;
      if (ent.refs <= 0) this.map.delete(k);
    }
  };
  
  private width: number;
  private map: Map<string, any>;
  
  constructor(args: CompoundMapArgs<K, V>) {
    
    const { entries, width = entries![0][0].length } = args;

    if (width < 2)                   throw Error('Width must be >= 2');
    if (width !== Math.floor(width)) throw Error('Width must be an integer');
    
    this.width = width;
    this.map = new Map();
    
    for (const [ k, v ] of entries ?? []) this.set(k, v);
    
  }
  set(cmpKey: K, val: V): CompoundMap<K, V> {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    const key = CompoundMap.getKey(cmpKey);
    const last = key.pop()!;
    
    let ptr = this.map;
    for (const k of key) {
      if (!ptr.has(k)) ptr.set(k, new Map());
      ptr = ptr.get(k);
    }

    // Overwrites are essentially a set plus a delete, so the ref count remains unchanged
    const overwrite = ptr.has(last);
    ptr.set(last, val);
    if (!overwrite) CompoundMap.refInc(cmpKey);
    
    return this;
    
  }
  get(cmpKey: K): undefined | V {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    const key = CompoundMap.getKey(cmpKey);
    const last = key.pop()!;
    
    let ptr = this.map;
    for (const k of key) {
      if (!ptr.has(k)) return undefined;
      ptr = ptr.get(k);
    }
    
    return ptr.get(last);
    
  }
  has(cmpKey: K): boolean {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    const key = CompoundMap.getKey(cmpKey);
    const last = key.pop()!;
    
    let ptr = this.map;
    for (const k of key) {
      if (!ptr.has(k)) return false;
      ptr = ptr.get(k);
    }
    
    return ptr.has(last);
    
  }
  delete(cmpKey: K): boolean {
    
    if (cmpKey.length !== this.width) throw Error(`Key must have size ${this.width}`);
    
    const arr: { map: Map<string, any>, k: string }[] = [];
    const key = CompoundMap.getKey(cmpKey);
    const last = key.pop()!;
    
    let ptr = this.map;
    for (const k of key) {
      if (!ptr.has(k)) return false;
      arr.push({ map: ptr, k });
      ptr = ptr.get(k);
    }
    
    if (!ptr.has(last)) return false;
    
    // Delete, and do recursive cleanup
    ptr.delete(last);
    for (const { map, k } of arr.reverse()) {
      if (map.get(k).size > 0) break;
      map.delete(k);
    }
    
    CompoundMap.refDec(cmpKey);
    
    return true;
    
  }
  
  get size() { return this.map.size; }
  get length() { return this.map.size; }

}