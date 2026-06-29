
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase.from('professionals').insert([{ name: 'Teste Simples', phone: '99999999999', barbershop_id: '00000000-0000-0000-0000-000000000000' }]).select();
    console.log("Insert result:", { data, error });
}
test();
