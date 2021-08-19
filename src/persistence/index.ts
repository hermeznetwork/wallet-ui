import { Transaction, Exit } from '../domain'

export interface HistoryTransactions { transactions: Transaction[], pendingItems: number };
export interface HistoryExits { exits: Exit[], pendingItems: number };
