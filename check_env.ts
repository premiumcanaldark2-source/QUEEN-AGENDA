
import dotenv from 'dotenv';
dotenv.config();
const vars = Object.keys(process.env).filter(v => v.includes('DB') || v.includes('DATABASE') || v.includes('URL') || v.includes('KEY'));
console.log('Available related env vars:', vars);
if (process.env.DATABASE_URL) console.log('DATABASE_URL is set');
if (process.env.POSTGRES_URL) console.log('POSTGRES_URL is set');
