import { HermezTransaction, Exit, Account } from '../domain/hermez'

export interface Transactions { transactions: HermezTransaction[], pendingItems: number };
export interface Exits { exits: Exit[], pendingItems: number };
export interface Accounts { accounts: Account[], pendingItems: number };
