type CompoundKey = any[];
export default class CompoundMap<K extends CompoundKey, V> {
    static cnt: number;
    static map: WeakMap<object, any>;
    static isPrimitive: (v: any) => boolean;
    static uniqueStr: (val: any) => any;
    static getKey: (cmpKey: any) => any;
    static refInc: (cmpKey: any) => void;
    static refDec: (cmpKey: any) => void;
    private width;
    private map;
    constructor({ entries, width }?: {
        entries?: [K, V][];
        width?: any;
    });
    set(cmpKey: K, val: V): CompoundMap<K, V>;
    get(cmpKey: K): undefined | V;
    has(cmpKey: K): boolean;
    delete(cmpKey: K): boolean;
}
export {};
