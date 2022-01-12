import { PaginationOrder } from "@hermeznetwork/hermezjs/src/api";

// domain
import { HermezApiResourceItem } from "src/domain";

export type Pagination =
  | {
      hasMoreItems: true;
      fromItem: number;
    }
  | {
      hasMoreItems: false;
    };

/**
 * Checks if a request to a paginated API endpoint has more items pending to retrieve
 */
function getPaginationData(
  pendingItems: number,
  items: HermezApiResourceItem[],
  order: PaginationOrder = "ASC"
): Pagination {
  if (pendingItems === 0) {
    return { hasMoreItems: false };
  }

  const fromItem: number =
    order === "ASC" ? items[items.length - 1].itemId + 1 : items[items.length - 1].itemId - 1;

  return { hasMoreItems: true, fromItem };
}

export { getPaginationData };
