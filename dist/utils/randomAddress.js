"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomAddress = void 0;
const core_1 = require("@ton/core");
function randomAddress(workchain = 0) {
    const b = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) {
        b[i] = Math.floor(Math.random() * 256);
    }
    return new core_1.Address(workchain, b);
}
exports.randomAddress = randomAddress;