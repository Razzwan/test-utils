import { Address, Cell, Slice } from '@ton/core';
import { CompareResult } from "./interface";
export declare function compareCellForTest(subject: any, cmp: Cell): CompareResult;
export declare function compareAddressForTest(subject: any, cmp: Address): CompareResult;
export declare function compareSliceForTest(subject: any, cmp: Slice): CompareResult;
export declare function gasUsage(messageResult: any): bigint;
export declare function gasCompare(messageResult: any, toCompare: bigint, accuracy?: bigint): boolean;
export declare function gasUsageForTest(subject: any, cmp: bigint, accuracy?: bigint): CompareResult;
