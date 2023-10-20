"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
const comparisons_1 = require("./comparisons");
function wrapComparer(comparer) {
    return function (actual, cmp, ...rest) {
        const result = comparer(actual, cmp, ...rest);
        return {
            pass: result.pass,
            message: () => {
                if (result.pass) {
                    return result.negMessage();
                }
                else {
                    return result.posMessage();
                }
            },
        };
    };
}
const toHaveTransaction = wrapComparer(transaction_1.compareTransactionForTest);
const toEqualCell = wrapComparer(comparisons_1.compareCellForTest);
const toEqualAddress = wrapComparer(comparisons_1.compareAddressForTest);
const toEqualSlice = wrapComparer(comparisons_1.compareSliceForTest);
const toApproxGasUsage = wrapComparer(comparisons_1.gasUsageForTest);
try {
    const jestGlobals = require("@jest/globals");
    if (jestGlobals)
        jestGlobals.expect.extend({
            toHaveTransaction,
            toEqualCell,
            toEqualAddress,
            toEqualSlice,
            toApproxGasUsage,
        });
}
catch (e) { }
