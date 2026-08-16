import { apiFetch } from './apiClient'; import { WalletRiskProfile } from '../types/crypto';
class WalletService { private cache=new Map<string,WalletRiskProfile>(); async getWalletProfile(address:string){const key=address.trim().toLowerCase();const cached=this.cache.get(key);if(cached)return cached;const r=await apiFetch<{profile:WalletRiskProfile}>(`/wallets/${encodeURIComponent(address.trim())}`);this.cache.set(key,r.profile);return r.profile;} }
export const walletService=new WalletService();
