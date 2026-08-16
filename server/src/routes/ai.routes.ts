import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { runAnalysis } from '../services/ai.service.js';
import { query } from '../db.js';
const router=Router();router.use(requireAuth);
router.post('/analyze',async(req,res,next)=>{try{const schema=z.object({walletAddress:z.string().optional(),transactionHash:z.string().optional(),currency:z.string().optional(),amount:z.number().nonnegative().optional(),notes:z.string().max(1000).optional()}).refine(v=>v.walletAddress||v.transactionHash,{message:'Wallet address or transaction hash is required.'});const input=schema.parse(req.body);res.json({result:await runAnalysis(input,req.user!.id)});}catch(e){next(e);}});
router.get('/analyses',async(req,res,next)=>{try{const r=await query('SELECT * FROM analyses WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100',[req.user!.id]);res.json({analyses:r.rows});}catch(e){next(e);}});
export default router;
