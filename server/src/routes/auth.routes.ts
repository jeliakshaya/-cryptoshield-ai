import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { query } from '../db.js';
import { signToken } from '../utils/auth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const registerSchema = z.object({ name:z.string().trim().min(2), email:z.string().email(), password:z.string().min(8) });
const loginSchema = z.object({ email:z.string().email(), password:z.string().min(1) });

function userDto(row:any) { return { id:row.id,name:row.name,email:row.email,role:row.role,avatar:row.avatar,department:row.department,lastLogin:row.last_login ? new Date(row.last_login).toISOString() : new Date().toISOString() }; }

router.post('/register', async (req,res,next) => { try {
  const input=registerSchema.parse(req.body); const exists=await query('SELECT id FROM users WHERE email=$1',[input.email.toLowerCase()]);
  if(exists.rowCount) return res.status(409).json({message:'An account with this email already exists.'});
  const id=randomUUID(), hash=await bcrypt.hash(input.password,12); const avatar='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
  const result=await query('INSERT INTO users(id,name,email,password_hash,role,avatar,department,last_login) VALUES($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *',[id,input.name,input.email.toLowerCase(),hash,'SOC Security Analyst',avatar,'Multi-Chain Anomaly Response']);
  const user=userDto(result.rows[0]); res.status(201).json({user,token:signToken({id:user.id,email:user.email,role:user.role})});
} catch(e){next(e);} });

router.post('/login', async (req,res,next)=>{ try { const input=loginSchema.parse(req.body); const result=await query('SELECT * FROM users WHERE email=$1',[input.email.toLowerCase()]); if(!result.rowCount) return res.status(401).json({message:'Invalid email or password.'}); const row=result.rows[0]; if(!(await bcrypt.compare(input.password,row.password_hash))) return res.status(401).json({message:'Invalid email or password.'}); await query('UPDATE users SET last_login=NOW(),updated_at=NOW() WHERE id=$1',[row.id]); const updated={...row,last_login:new Date()}; const user=userDto(updated); res.json({user,token:signToken({id:user.id,email:user.email,role:user.role})}); } catch(e){next(e);} });
router.get('/me',requireAuth,async(req,res,next)=>{try{const r=await query('SELECT * FROM users WHERE id=$1',[req.user!.id]);if(!r.rowCount)return res.status(401).json({message:'User not found.'});res.json({user:userDto(r.rows[0])});}catch(e){next(e);}});
router.put('/profile',requireAuth,async(req,res,next)=>{try{const schema=z.object({name:z.string().trim().min(2),email:z.string().email(),department:z.string().trim().min(2)});const input=schema.parse(req.body);const r=await query('UPDATE users SET name=$1,email=$2,department=$3,updated_at=NOW() WHERE id=$4 RETURNING *',[input.name,input.email.toLowerCase(),input.department,req.user!.id]);res.json({user:userDto(r.rows[0])});}catch(e){next(e);}});
export default router;
