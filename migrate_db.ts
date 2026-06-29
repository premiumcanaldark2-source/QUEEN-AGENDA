
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log("Tentando migração via RPC 'exec_sql' (se existir)...");
    const sql = `
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='working_hours_type') THEN
                ALTER TABLE professionals ADD COLUMN working_hours_type TEXT DEFAULT 'shop';
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='custom_start_time') THEN
                ALTER TABLE professionals ADD COLUMN custom_start_time TEXT DEFAULT '08:00';
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professionals' AND column_name='custom_end_time') THEN
                ALTER TABLE professionals ADD COLUMN custom_end_time TEXT DEFAULT '20:00';
            END IF;
        END $$;
    `;
    
    // Tentativa desesperada: RPC 'exec_sql' é comum em templates Supabase customizados
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
        console.error("Erro na migração RPC:", error);
        console.log("O RPC 'exec_sql' provavelmente não existe. Você precisará executar o SQL manualmente no console do Supabase.");
    } else {
        console.log("Migração concluída com sucesso via RPC!");
    }
}

migrate();
