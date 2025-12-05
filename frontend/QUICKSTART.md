# 🚀 Quick Start Guide - JRF SecureNotify Frontend

Guia rápido para colocar o frontend rodando em menos de 5 minutos.

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Passo 1: Clonar o Repositório

```bash
git clone https://github.com/djefarias/monitoramento.git
cd monitoramento/frontend
```

## Passo 2: Instalar Dependências

```bash
npm install
```

## Passo 3: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.local.example .env.local
```

O arquivo `.env.local` já vem com as configurações padrão. Se necessário, edite:

```env
NEXT_PUBLIC_API_BASE_URL=https://jrf-securenotify-64944549.azurewebsites.net
NEXT_PUBLIC_APP_NAME=JRF SecureNotify
NEXT_PUBLIC_LOGO_URL=/logo-placeholder.svg
NEXT_PUBLIC_PRIMARY_COLOR=#3B82F6
NEXT_PUBLIC_SECONDARY_COLOR=#1E40AF
```

## Passo 4: Rodar o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## Passo 5: Fazer Login

Use as credenciais de operador cadastradas no backend.

Se ainda não tiver um operador cadastrado, você pode criar um através do endpoint:
```bash
POST https://jrf-securenotify-64944549.azurewebsites.net/api/auth/register
Header: X-Admin-Secret: <seu_admin_secret>
Body: {
  "email": "admin@example.com",
  "password": "senha123",
  "name": "Administrador"
}
```

## ✅ Pronto!

Agora você pode:
1. Cadastrar clientes
2. Enviar alertas
3. Gerenciar o sistema

---

## 🎨 Customizar Branding

Para personalizar a interface:

1. **Trocar Logo:**
   - Coloque sua logo em `public/sua-logo.png`
   - Atualize `.env.local`: `NEXT_PUBLIC_LOGO_URL=/sua-logo.png`

2. **Mudar Nome:**
   - Atualize `.env.local`: `NEXT_PUBLIC_APP_NAME=Sua Empresa`

3. **Alterar Cores:**
   - Atualize `.env.local`:
   ```env
   NEXT_PUBLIC_PRIMARY_COLOR=#10B981
   NEXT_PUBLIC_SECONDARY_COLOR=#059669
   ```

Reinicie o servidor (`npm run dev`) para ver as mudanças.

---

## 🚀 Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Configure as mesmas variáveis de ambiente no painel da Vercel.

---

## 🆘 Problemas Comuns

### Erro CORS
- Verifique se o backend aceita requisições da URL do frontend
- Configure CORS na Function App do Azure

### Erro de Autenticação
- Verifique se as credenciais estão corretas
- Verifique se o backend está rodando

### WhatsApp Não Configurado
- Configure `WHATSAPP_TOKEN` e `WHATSAPP_PHONE_ID` no backend
- Veja documentação no README principal

---

**Precisa de ajuda?** Consulte o [README completo](./README.md)
