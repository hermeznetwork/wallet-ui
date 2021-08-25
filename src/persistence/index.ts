import { HermezTransaction, Exit } from '../domain'

export interface HistoryTransactions { transactions: HermezTransaction[], pendingItems: number };
export interface HistoryExits { exits: Exit[], pendingItems: number };
