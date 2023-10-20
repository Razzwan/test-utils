import { FlatTransactionComparable } from "./transaction";
import { Address, Cell, Slice } from "@ton/core";
declare global {
    export namespace jest {
        interface Matchers<R> {
            toHaveTransaction(cmp: FlatTransactionComparable): R;
            toEqualCell(cell: Cell): R;
            toEqualAddress(address: Address): R;
            toEqualSlice(slice: Slice): R;
        }
    }
}