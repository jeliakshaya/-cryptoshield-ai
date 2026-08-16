import { apiFetch } from './apiClient';
import { Transaction } from '../types/crypto';

class LiveTransactionService {
  async loadBitcoin(): Promise<Transaction[]> {
    const result = await apiFetch<{ transactions: Transaction[] }>('/live/bitcoin');
    return result.transactions;
  }
}
export const liveTransactionService = new LiveTransactionService();
