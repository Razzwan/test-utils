import { Address, Cell, Slice } from "@ton/core";
import { CompareResult } from "./interface";

export function compareCellForTest(subject: any, cmp: Cell): CompareResult {
    return {
        pass: cmp.equals(subject),
        posMessage: ((subject: any, cmp: Cell) => `Expected\n${subject}\nto equal\n${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject: any, cmp: Cell) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(undefined, subject, cmp),
    }
}

export function compareAddressForTest(subject: any, cmp: Address): CompareResult {
    return {
        pass: cmp.equals(subject),
        posMessage: ((subject: any, cmp: Address) => `Expected ${subject} to equal ${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject: any, cmp: Address) => `Expected ${subject} NOT to equal ${cmp}, but it does`).bind(undefined, subject, cmp),
    }
}

export function compareSliceForTest(subject: any, cmp: Slice): CompareResult {
    return {
        pass: cmp.asCell().equals(subject.asCell()),
        posMessage: ((subject: any, cmp: Slice) => `Expected\n${subject}\nto equal\n${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject: any, cmp: Slice) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(undefined, subject, cmp),
    }
}


export function gasUsage(messageResult: any): bigint {
    try {
        return messageResult.transactions.reduce((gas, tx) => {
            return gas + tx.totalFees.coins;
        }, 0n)
    } catch (e) {
        console.info("Compared object is not SendMessageResult");
        return 0n
    }

}

export function gasCompare(messageResult: any, toCompare: bigint, accuracy: bigint = 2n): boolean {
    const gas = gasUsage(messageResult);
    if (gas >= toCompare - accuracy) {
        if (gas <= toCompare + accuracy) {
            return true;
        }
    }
    return false;
}
export function gasUsageForTest(subject: any, cmp: bigint, accuracy: bigint = 2n): CompareResult {
    return {
        pass: gasCompare(subject, cmp, accuracy),
        posMessage: ((subject: any, cmp: bigint, accuracy?: bigint) => `Expected\ngas usage of message transactions\nto equal\n${cmp}${accuracy === 0n ? '' : `±${accuracy}`}`).bind(undefined, subject, cmp, accuracy),
        negMessage: ((subject: any, cmp: bigint, accuracy?: bigint) => `Expected\ngas usage of message transactions\nNOT to equal\n${cmp}${accuracy === 0n ? '' : `±${accuracy}`}\nbut it does`).bind(undefined, subject, cmp, accuracy),
    }
}
