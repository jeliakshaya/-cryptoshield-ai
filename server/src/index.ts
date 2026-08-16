import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import routes from './routes/index.js';
import { pool } from './db.js';

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: config.frontendUrl, credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.get('/', (_req,res)=>res.json({name:'CryptoShield API',version:'1.0.0'}));
app.use('/api', routes);
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  console.error(err);
  if(err?.name==='ZodError') return res.status(400).json({message:'Invalid request data.',issues:err.issues});
  res.status(500).json({message:config.nodeEnv==='production'?'Internal server error.':err?.message||'Internal server error.'});
});
const server=app.listen(config.port,()=>console.log(`CryptoShield API listening on http://localhost:${config.port}`));
const shutdown=async()=>{server.close();await pool.end();process.exit(0);};
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
