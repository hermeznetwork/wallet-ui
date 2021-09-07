import { PaginationOrder } from "@hermeznetwork/hermezjs/src/api";

// domain
import { HermezApiResourceItem } from "src/domain/hermez";

export interface Pagination {
  fromItem?: number;
  hasMoreItems: boolean;
}

/**
 * Checks if a request to a paginated API endpoint has more items pending to retrieve
 * @param {Number} pendingItems - Pending items to retrieve from a paginated API endpoint
 * @param {Array} items - List of HermezApiResourceItem
 * @param {PaginationOrder} order - hermezJS PaginationOrder options
 * @returns {Pagination} - Pagination information for the next request
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
    order === "ASC"
      ? items[items.length - 1].itemId + 1
      : items[items.length - 1].itemId - 1;

  return { hasMoreItems: true, fromItem };
}

export { getPaginationData };
