import { Address, Cell, Slice } from "@ton/core";
import { FlatTransactionComparable } from "./transaction";
declare global {
    export namespace Chai {
        interface Assertion {
            transaction(cmp: FlatTransactionComparable): void;
            equalCell(cell: Cell): void;
            equalAddress(address: Address): void;
            equalSlice(slice: Slice): void;
        }
    }
}