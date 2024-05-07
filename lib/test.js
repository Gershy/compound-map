"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
let obj1 = { desc: 'obj' };
let obj2 = { desc: 'obj' };
let tests = [
    {
        entries: [
            { cmpKey: ['a', 1], val: 'my value' },
        ],
        lookups: [
            { cmpKey: ['a', 1], expected: 'my value' },
            { cmpKey: [1, 'a'], expected: 'my value' },
            { cmpKey: ['a', 2], expected: undefined },
            { cmpKey: ['b', 1], expected: undefined },
            { cmpKey: [2, 'a'], expected: undefined },
            { cmpKey: [1, 'b'], expected: undefined }
        ]
    },
    {
        entries: [
            { cmpKey: ['a', 'b', 'c'], val: obj1 },
            { cmpKey: ['c', 'd', 'e'], val: obj2 }
        ],
        lookups: [
            { cmpKey: ['a', 'd', 'e'], expected: undefined },
            { cmpKey: ['c', 'b', 'a'], expected: obj1 },
            { cmpKey: ['d', 'e', 'c'], expected: obj2 }
        ]
    }
];
for (let { entries, lookups } of tests) {
    let cm = new main_1.default({ entries: entries.map(({ cmpKey, val }) => [cmpKey, val]) });
    for (let { cmpKey, expected } of lookups) {
        let received = cm.get(cmpKey);
        if (received !== expected) {
            console.log(`Test Failed! Expected [ ${cmpKey.join(', ')} ] -> ${JSON.stringify(expected)} ... BUT GOT ${JSON.stringify(received)}`);
        }
        else {
            console.log(`Test Passed! [ ${cmpKey.join(', ')} ] -> ${JSON.stringify(expected)}`);
        }
    }
}
{
    let k1 = [];
    let k2 = {};
    let k3a = 'a';
    let k3b = /jajaja/;
    let cm = new main_1.default({ width: 3 });
    if (cm.get([k1, k2, k3a]) !== undefined)
        throw Error('Ow');
    cm.set([k3a, k1, k2], 'lol');
    if (cm.get([k1, k3a, k2]) !== 'lol')
        throw Error('Ow');
    cm.delete([k2, k3a, k1]);
    if (cm.get([k3a, k2, k1]) !== undefined)
        throw Error('Ow');
    cm.set([k3b, k1, k2], 'lol');
    cm.delete([k3b, k1, k2]);
    if (cm.map.size !== 0)
        throw Error('Ow');
    console.log('Deletion test passed!');
}
//# sourceMappingURL=test.js.map