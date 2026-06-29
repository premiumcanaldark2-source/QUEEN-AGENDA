
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSave() {
    console.log("Testando inserção de profissional com novos campos...");
    const { data, error } = await supabase.from('professionals').insert([{
        name: 'Teste de Campos',
        phone: '00000000000',
        barbershop_id: '00000000-0000-4000-a000-000000000000', // ID fictício
        working_hours_type: 'custom',
        custom_start_time: '10:00',
        custom_end_time: '18:00'
    }]).select();

    if (error) {
        console.error("ERRO AO SALVAR:", error);
    } else {
        console.log("SUCESSO AO SALVAR:", data);
        // Limpar teste
        await supabase.from('professionals').delete().eq('name', 'Teste de Campos');
    }
}

testSave();
