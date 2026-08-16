import { AIAnalysisResult, AnalysisRequest } from '../types/crypto'; import { apiFetch } from './apiClient';
export async function analyzeTransactionOrWallet(request:AnalysisRequest,onProgress?:(step:string,percent:number)=>void):Promise<AIAnalysisResult>{
 const stages=[['Data preprocessing & sanitization',15],['Extracting graph and behavioral features',40],['Running backend risk inference',70],['Calculating anomaly score & confidence',90]] as const;
 for(const [step,pct] of stages){onProgress?.(step,pct);await new Promise(r=>setTimeout(r,150));}
 const r=await apiFetch<{result:AIAnalysisResult}>('/ai/analyze',{method:'POST',body:JSON.stringify(request)});onProgress?.('Finalizing risk score & explainability',100);return r.result;
}
