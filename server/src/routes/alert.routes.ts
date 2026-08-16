import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { alertRow } from '../utils/serialize.js';
const router=Router();router.use(requireAuth);
router.get('/',async(req,res,next)=>{try{const {severity,status}=req.query;const p:any[]=[];const where:string[]=[];if(severity&&severity!=='all'){p.push(severity);where.push(`severity=$${p.length}`);}if(status&&status!=='all'){p.push(status);where.push(`status=$${p.length}`);}const r=await query(`SELECT * FROM alerts ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY timestamp DESC`,p);res.json({alerts:r.rows.map(alertRow)});}catch(e){next(e);}});
router.get('/unread-count',async(_req,res,next)=>{try{const r=await query(`SELECT COUNT(*)::int AS count FROM alerts WHERE status IN ('open','investigating')`);res.json({count:r.rows[0].count});}catch(e){next(e);}});
router.patch('/:id/status',async(req,res,next)=>{try{const allowed=['open','investigating','resolved','ignored'];if(!allowed.includes(req.body.status))return res.status(400).json({message:'Invalid alert status.'});const r=await query('UPDATE alerts SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *',[req.body.status,req.params.id]);if(!r.rowCount)return res.status(404).json({message:'Alert not found.'});res.json({alert:alertRow(r.rows[0])});}catch(e){next(e);}});
export default router;
