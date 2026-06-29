INSTRUÃ‡Ã•ES PARA HOSPEDAGEM NA HOSTGATOR (cPanel)
==============================================

Para rodar o sistema IVO BARBER na HostGator sem erros, siga estes passos:

1. CONFIGURAÃ‡ÃƒO DO NODE.JS NO CPANEL:
   - Procure por "Setup Node.js App" ou "Selecionar VersÃ£o do Node.js".
   - Clique em "Create Application".
   - Node.js Version: Escolha 18.x ou 20.x (recomendado).
   - Application Mode: Production.
   - Application Root: O nome da pasta onde vocÃª enviou os arquivos (ex: ivobarber).
   - Application URL: O seu domÃnio (ex: seu-site.com.br).
   - Application Startup file: app.js (jÃ¡ criamos este arquivo para vocÃª).

2. VARIÃVEIS DE AMBIENTE:
   - No mesmo menu do Node.js no cPanel, localize a seÃ§Ã£o "Environment variables".
   - Adicione as seguintes chaves (copie do seu arquivo .env atual):
     - SUPABASE_URL
     - SUPABASE_SERVICE_ROLE_KEY
     - GEMINI_API_KEY (se estiver usando IA)
     - VAPID_PUBLIC_KEY
     - VAPID_PRIVATE_KEY
   - Clique em "Save".

3. INSTALAÃ‡ÃƒO E BUILD:
   - Clique no botÃ£o "Run NPM Install" no menu do Node.js.
   - ApÃ³s instalar, vocÃª precisa gerar a pasta 'dist'. VocÃª pode fazer isso de duas formas:
     a) Via Terminal/SSH no cPanel: entre na pasta do app e digite: npm run build
     b) Localmente: rode 'npm run build' no seu computador e envie a pasta 'dist' inteira para o servidor via FTP/Gerenciador de Arquivos.

4. DICA PARA A TELA BRANCA:
   - A tela branca geralmente acontece se a pasta 'dist' nÃ£o existir no servidor ou se o caminho do 'base' no Vite estiver incorreto. 
   - Certifique-se de que a pasta 'dist' estÃ¡ na raiz da sua Application Root.
   - Se o seu site ficar em uma subpasta (ex: seu-site.com.br/sistema), avise o programador para ajustar o "base path".

5. REINICIAR:
   - Sempre que fizer uma alteraÃ§Ã£o, clique em "Restart" no menu do Node.js do cPanel.

O arquivo app.js e as otimizaÃ§Ãµes no server.ts jÃ¡ foram feitos para garantir que as rotas funcionem perfeitamente.
