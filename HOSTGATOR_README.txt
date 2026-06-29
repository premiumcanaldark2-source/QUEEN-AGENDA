INSTRUÃ‡Ã•ES PARA HOSPEDAGEM NA HOSTGATOR (cPanel)
==============================================

Para rodar o sistema IVO BARBER na HostGator sem erros, siga estes passos:

1. CONFIGURAÃ‡ÃƒO DO NODE.JS NO CPANEL:
   - Procure por "Setup Node.js App".
   - Application Startup file: app.js
   - Application URL: Garanta que o domÃnio esteja correto.

2. ARQUIVOS NECESSÃ RIOS NA RAIZ (public_html ou pasta do app):
   - app.js (criado por nÃ³s)
   - .htaccess (criado por nÃ³s para resolver o ERRO 403)
   - pasta 'dist' (contÃ©m o index.html e os arquivos do sistema)
   - pasta 'api'
   - package.json

3. RESOLVENDO O ERRO 403 E TELA BRANCA:
   - O ERRO 403 acontece porque o servidor Apache tenta listar arquivos. O arquivo .htaccess que criamos corrige isso.
   - A TELA BRANCA acontece se a pasta 'dist' nÃ£o estiver no servidor. VocÃª DEVE rodar 'npm run build' antes de enviar os arquivos.

4. COMO GERAR O INDEX.HTML CORRETAMENTE:
   - No terminal (SSH) da HostGator, dentro da pasta do projeto, rode:
     npm install
     npm run build
   - Isso criarÃ¡ a pasta 'dist' com o index.html otimizado. O arquivo app.js vai carregar esse index automaticamente.

5. VARIÃ VEIS DE AMBIENTE:
   - Configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e outras no menu do Node.js no cPanel.

DICA: Se mudar o sistema de pasta (ex: de raiz para /sistema), reinicie o app no cPanel.
