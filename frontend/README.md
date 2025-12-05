# JRF SecureNotify - Frontend

Frontend moderno desenvolvido em Next.js 14 com App Router para o sistema JRF SecureNotify WHATSAPP.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **React Hook Form + Zod** - Validação de formulários
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **JS Cookie** - Gerenciamento de cookies

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite o .env.local com suas configurações
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```env
# URL do backend (Azure Functions)
NEXT_PUBLIC_API_BASE_URL=https://jrf-securenotify-64944549.azurewebsites.net

# Configurações de Branding
NEXT_PUBLIC_APP_NAME=JRF SecureNotify
NEXT_PUBLIC_LOGO_URL=/logo-placeholder.svg
NEXT_PUBLIC_PRIMARY_COLOR=#3B82F6
NEXT_PUBLIC_SECONDARY_COLOR=#1E40AF
```

## 🎨 Customização de Branding

O sistema foi desenvolvido para ser facilmente customizável:

### 1. Logo

**Opção A: Arquivo local**
- Substitua o arquivo `public/logo-placeholder.svg`
- Formatos suportados: SVG, PNG, JPG
- Dimensões recomendadas: 200x60px

**Opção B: URL externa**
- Configure `NEXT_PUBLIC_LOGO_URL` com a URL da logo

### 2. Nome da Aplicação

Configure `NEXT_PUBLIC_APP_NAME`:
```env
NEXT_PUBLIC_APP_NAME=Minha Empresa
```

### 3. Cores

Configure as cores principais da interface:

```env
NEXT_PUBLIC_PRIMARY_COLOR=#3B82F6    # Azul (padrão)
NEXT_PUBLIC_SECONDARY_COLOR=#1E40AF  # Azul escuro (padrão)
```

Exemplos de paletas:
- **Verde:** `#10B981` e `#059669`
- **Roxo:** `#8B5CF6` e `#7C3AED`
- **Vermelho:** `#EF4444` e `#DC2626`

## 💻 Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
# Acesse http://localhost:3000

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
frontend/
├── public/                    # Assets estáticos
│   └── logo-placeholder.svg
├── src/
│   ├── app/                   # Pages (App Router)
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Página inicial (redireciona)
│   │   ├── login/             # Página de login
│   │   └── dashboard/         # Dashboard autenticado
│   │       ├── layout.tsx     # Layout com header/sidebar
│   │       ├── page.tsx       # Dashboard home
│   │       ├── clientes/      # Gestão de clientes
│   │       └── alertas/       # Envio de alertas
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Header.tsx         # Cabeçalho
│   │   ├── Sidebar.tsx        # Menu lateral
│   │   ├── ProtectedRoute.tsx # HOC para rotas protegidas
│   │   ├── ClientForm.tsx     # Formulário de cliente
│   │   ├── ClientList.tsx     # Lista de clientes
│   │   └── AlertForm.tsx      # Formulário de alerta
│   ├── contexts/              # React Contexts
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── lib/                   # Utilitários
│   │   ├── api.ts             # Cliente HTTP
│   │   ├── auth.ts            # Funções de auth
│   │   └── branding.ts        # Configurações de branding
│   └── types/                 # TypeScript types
│       └── index.ts
├── .env.local.example         # Exemplo de variáveis
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🔐 Autenticação

O sistema utiliza autenticação JWT:

1. **Login:** Usuário faz login com email/senha
2. **Token:** Backend retorna token JWT
3. **Armazenamento:** Token armazenado em cookie HTTP-only
4. **Requisições:** Token enviado automaticamente no header `Authorization: Bearer {token}`
5. **Proteção:** Rotas protegidas redirecionam para login se não autenticado

## 📱 Funcionalidades

### Dashboard
- Visão geral do sistema
- Navegação rápida para funcionalidades principais

### Gestão de Clientes
- ✅ Cadastro de novos clientes
- ✅ Validação de campos (nome e telefone obrigatórios)
- ✅ Listagem com busca/filtro
- ✅ Busca por nome, apelido ou telefone

### Envio de Alertas
- ✅ Seleção múltipla de destinatários
- ✅ Busca e filtro de clientes
- ✅ Botões "Selecionar Todos" / "Desselecionar Todos"
- ✅ Editor de mensagem
- ✅ Feedback detalhado do envio:
  - Status de sucesso/erro para cada contato
  - Indicação quando WhatsApp não está configurado
  - Mensagens de erro claras

## 🚀 Deploy

### Vercel (Recomendado)

1. **Instalar Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configurar Variáveis de Ambiente:**
- Acesse o dashboard da Vercel
- Vá em Settings > Environment Variables
- Adicione todas as variáveis `NEXT_PUBLIC_*`

4. **CORS no Backend:**
- Configure CORS na Function App para permitir o domínio da Vercel
- Exemplo: `https://seu-app.vercel.app`

### Deploy Manual

```bash
# Build
npm run build

# Servidor de produção
npm start
```

## 🔧 Integração com Backend

O frontend se comunica com o backend Azure Functions através dos seguintes endpoints:

### Autenticação
- `POST /api/auth/login` - Login de operador
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Contatos
- `GET /api/contacts` - Listar todos os contatos
- `POST /api/contacts` - Criar novo contato

### Alertas
- `POST /api/send-alert` - Enviar alerta para múltiplos contatos

## 🐛 Troubleshooting

### CORS Errors
Se você receber erros de CORS:
1. Verifique se o backend está configurado para aceitar requisições do frontend
2. Configure o CORS na Function App do Azure

### Token Expirado
Se o token expirar:
1. O sistema redireciona automaticamente para login
2. Faça login novamente para obter novo token

### WhatsApp Não Configurado
Se aparecer mensagem de "WhatsApp não configurado":
1. Configure `WHATSAPP_TOKEN` e `WHATSAPP_PHONE_ID` no backend
2. Os alertas ficarão com status "pending_config" até a configuração

## 📄 Licença

Propriedade de JRF SecureNotify. Todos os direitos reservados.

---

**Desenvolvido com ❤️ usando Next.js 14**
