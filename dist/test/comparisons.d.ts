import { Address, Cell, Slice } from "@ton/core";
import { CompareResult } from "./interface";
export declare function compareCellForTest(subject: any, cmp: Cell): CompareResult;
export declare function compareAddressForTest(subject: any, cmp: Address): CompareResult;
export declare function compareSliceForTest(subject: any, cmp: Slice): CompareResult;
