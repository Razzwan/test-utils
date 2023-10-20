"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasUsageForTest = exports.gasCompare = exports.gasUsage = exports.compareSliceForTest = exports.compareAddressForTest = exports.compareCellForTest = void 0;
function compareCellForTest(subject, cmp) {
    return {
        pass: cmp.equals(subject),
        posMessage: ((subject, cmp) => `Expected\n${subject}\nto equal\n${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject, cmp) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(undefined, subject, cmp),
    };
}
exports.compareCellForTest = compareCellForTest;
function compareAddressForTest(subject, cmp) {
    return {
        pass: cmp.equals(subject),
        posMessage: ((subject, cmp) => `Expected ${subject} to equal ${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject, cmp) => `Expected ${subject} NOT to equal ${cmp}, but it does`).bind(undefined, subject, cmp),
    };
}
exports.compareAddressForTest = compareAddressForTest;
function compareSliceForTest(subject, cmp) {
    return {
        pass: cmp.asCell().equals(subject.asCell()),
        posMessage: ((subject, cmp) => `Expected\n${subject}\nto equal\n${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject, cmp) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(undefined, subject, cmp),
    };
}
exports.compareSliceForTest = compareSliceForTest;
function gasUsage(messageResult) {
    try {
        const transactions = Array.isArray(messageResult.transactions) ? messageResult.transactions : (Array.isArray(messageResult) ? messageResult : [messageResult]);
        return transactions.reduce((gas, tx) => {
            return gas + tx.totalFees.coins;
        }, 0n);
    }
    catch (e) {
        throw new Error("Compared object is not SendMessageResult nor transaction(s)");
    }
}
exports.gasUsage = gasUsage;
function gasCompare(messageResult, toCompare, accuracy = 2n) {
    const gas = gasUsage(messageResult);
    if (gas >= toCompare - accuracy) {
        if (gas <= toCompare + accuracy) {
            return [gas, true];
        }
    }
    return [gas, false];
}
exports.gasCompare = gasCompare;
function gasUsageForTest(subject, cmp, accuracy = 2n) {
    const [gas, pass] = gasCompare(subject, cmp, accuracy);
    return {
        pass,
        posMessage: ((subject, cmp, accuracy) => `Expected ${gas} to equal ${cmp}${accuracy === 0n ? '' : `±${accuracy}`}`).bind(undefined, subject, cmp, accuracy),
        negMessage: ((subject, cmp, accuracy) => `Expected ${gas} NOT to equal ${cmp}${accuracy === 0n ? '' : `±${accuracy}`} but it does`).bind(undefined, subject, cmp, accuracy),
    };
}
exports.gasUsageForTest = gasUsageForTest;
