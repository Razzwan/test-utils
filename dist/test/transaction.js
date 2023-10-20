"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTransactionForTest = exports.compareTransaction = exports.flattenTransaction = void 0;
const core_1 = require("@ton/core");
const node_inspect_extracted_1 = require("node-inspect-extracted");
function extractOp(body) {
    const s = body.beginParse();
    if (s.remainingBits >= 32) {
        return s.loadUint(32);
    }
    else {
        return undefined;
    }
}
function flattenTransaction(tx) {
    return {
        lt: tx.lt,
        now: tx.now,
        outMessagesCount: tx.outMessagesCount,
        oldStatus: tx.oldStatus,
        endStatus: tx.endStatus,
        totalFees: tx.totalFees.coins,
        ...(tx.inMessage ? {
            from: tx.inMessage.info.src instanceof core_1.Address ? tx.inMessage.info.src : undefined,
            to: tx.inMessage.info.dest,
            on: tx.inMessage.info.dest,
            value: tx.inMessage.info.type === 'internal' ? tx.inMessage.info.value.coins : undefined,
            body: tx.inMessage.body,
            inMessageBounced: tx.inMessage.info.type === 'internal' ? tx.inMessage.info.bounced : undefined,
            inMessageBounceable: tx.inMessage.info.type === 'internal' ? tx.inMessage.info.bounce : undefined,
            op: extractOp(tx.inMessage.body),
            initData: tx.inMessage.init?.data ?? undefined,
            initCode: tx.inMessage.init?.code ?? undefined,
            deploy: tx.inMessage.init ? (tx.oldStatus == 'active' && tx.endStatus === 'active') : false,
        } : {
            from: undefined,
            to: undefined,
            on: undefined,
            value: undefined,
            body: undefined,
            inMessageBounced: undefined,
            inMessageBounceable: undefined,
            op: undefined,
            initData: undefined,
            initCode: undefined,
            deploy: false,
        }),
        ...(tx.description.type === 'generic'
            || tx.description.type === 'tick-tock'
            || tx.description.type === 'split-prepare'
            || tx.description.type === 'merge-install'
            ? {
                aborted: tx.description.aborted,
                destroyed: tx.description.destroyed,
                exitCode: tx.description.computePhase.type === 'vm' ? tx.description.computePhase.exitCode : undefined,
                actionResultCode: tx.description.actionPhase?.resultCode,
                success: tx.description.computePhase.type === 'vm'
                    ? (tx.description.computePhase.success && tx.description.actionPhase?.success)
                    : false,
            } : {
            aborted: undefined,
            destroyed: undefined,
            exitCode: undefined,
            actionResultCode: undefined,
            success: undefined,
        }),
    };
}
exports.flattenTransaction = flattenTransaction;
function compareValue(a, b) {
    if (a instanceof core_1.Address) {
        if (!(b instanceof core_1.Address))
            return false;
        return a.equals(b);
    }
    if (a instanceof core_1.Cell) {
        if (!(b instanceof core_1.Cell))
            return false;
        return a.equals(b);
    }
    return a === b;
}
function compareTransaction(tx, cmp) {
    for (const key in cmp) {
        if (!(key in tx))
            throw new Error(`Unknown flat transaction object key ${key}`);
        const cmpv = cmp[key];
        const txv = tx[key];
        if (typeof cmpv === 'function') {
            if (!cmpv(txv))
                return false;
        }
        else {
            if (!compareValue(txv, cmpv))
                return false;
        }
    }
    return true;
}
exports.compareTransaction = compareTransaction;
function compareTransactionForTest(subject, cmp) {
    if (Array.isArray(subject)) {
        const arr = subject.map(tx => flattenTransaction(tx));
        return {
            pass: arr.some(ftx => compareTransaction(ftx, cmp)),
            posMessage: ((arr, cmp) => `Expected ${(0, node_inspect_extracted_1.inspect)(arr)} to contain a transaction that matches pattern ${(0, node_inspect_extracted_1.inspect)(cmp)}`).bind(undefined, arr, cmp),
            negMessage: ((arr, cmp) => `Expected ${(0, node_inspect_extracted_1.inspect)(arr)} NOT to contain a transaction that matches pattern ${(0, node_inspect_extracted_1.inspect)(cmp)}, but it does`).bind(undefined, arr, cmp),
        };
    }
    else {
        try {
            const flat = flattenTransaction(subject);
            return {
                pass: compareTransaction(flat, cmp),
                posMessage: ((flat, cmp) => `Expected ${(0, node_inspect_extracted_1.inspect)(flat)} to match pattern ${(0, node_inspect_extracted_1.inspect)(cmp)}`).bind(undefined, flat, cmp),
                negMessage: ((flat, cmp) => `Expected ${(0, node_inspect_extracted_1.inspect)(flat)} NOT to match pattern ${(0, node_inspect_extracted_1.inspect)(cmp)}, but it does`).bind(undefined, flat, cmp),
            };
        }
        catch (e) {
            if (subject.transactions !== undefined) {
                console.warn('It seems that a SendMessageResult is being used for this comparison. Please make sure to pass `result.transactions` instead of just `result` into the matcher.');
            }
            throw e;
        }
    }
}
exports.compareTransactionForTest = compareTransactionForTest;
