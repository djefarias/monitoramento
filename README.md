# JRF SecureNotify WHATSAPP

Solução SaaS completa para envio de alertas via WhatsApp Cloud API com autenticação JWT, gerenciamento de contatos e histórico de envios.

## 🚀 Estrutura do Projeto

```
monitoramento/
├── backend/          # Azure Functions (Serverless)
│   ├── src/
│   │   ├── auth/            # Endpoints de autenticação JWT
│   │   ├── contacts/        # CRUD de contatos
│   │   ├── alerts/          # Envio e consulta de alertas
│   │   ├── operators/       # Gerenciamento de operadores
│   │   └── shared/          # Utilitários (middleware, azure table)
│   ├── host.json
│   └── package.json
└── frontend/         # Interface Web Next.js (em desenvolvimento)
```

## ☁️ Infraestrutura Azure

### Recursos Criados
- **Resource Group:** `Monitoramento`
- **Storage Account:** `jrfmonitor64944495`
  - Tabelas: `contacts`, `alertslog`, `operators`
- **Function App:** `jrf-securenotify-64944549`
  - Runtime: Node.js 20
  - URL: https://jrf-securenotify-64944549.azurewebsites.net

### Arquitetura
- **Azure Functions** para backend serverless
- **Azure Table Storage** para persistência de dados
- **WhatsApp Cloud API** para envio de mensagens
- **Autenticação JWT** para segurança

## 🔧 Configuração

### Variáveis de Ambiente (Function App)

As seguintes variáveis já estão configuradas na Function App:

```
AZURE_STORAGE_CONNECTION_STRING=<connection_string>
JWT_SECRET=<secret_key>
ADMIN_SECRET=<admin_key>
WHATSAPP_TOKEN=<a_configurar>
WHATSAPP_PHONE_ID=<a_configurar>
```

### Como Configurar WhatsApp

Para habilitar o envio de alertas via WhatsApp, você precisa:

1. **Criar uma aplicação no Meta for Developers:**
   - Acesse https://developers.facebook.com/
   - Crie uma aplicação do tipo "Business"
   - Adicione o produto "WhatsApp"

2. **Obter credenciais:**
   - `WHATSAPP_TOKEN`: Token de acesso permanente da API
   - `WHATSAPP_PHONE_ID`: ID do número de telefone WhatsApp Business

3. **Configurar na Function App:**
   ```bash
   az functionapp config appsettings set \
     --name jrf-securenotify-64944549 \
     --resource-group Monitoramento \
     --settings WHATSAPP_TOKEN="seu_token" WHATSAPP_PHONE_ID="seu_phone_id"
   ```

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 20+
- Azure Functions Core Tools
- Conta Azure Storage (emulator ou real)

### Setup Backend

```bash
cd backend
npm install

# Configurar local.settings.json com suas credenciais
cp local.settings.json.example local.settings.json

# Executar localmente
npm start
```

### Endpoints Disponíveis

#### Autenticação
- `POST /api/auth/login` - Login de operador
- `POST /api/auth/register` - Registro de novo operador (requer ADMIN_SECRET)

#### Contatos
- `GET /api/contacts` - Listar todos os contatos
- `POST /api/contacts` - Criar novo contato
- `GET /api/contacts/{id}` - Buscar contato específico
- `PUT /api/contacts/{id}` - Atualizar contato
- `DELETE /api/contacts/{id}` - Deletar contato

#### Alertas
- `POST /api/alerts/send` - Enviar alerta via WhatsApp
- `GET /api/alerts/history` - Consultar histórico de envios

#### Operadores
- `GET /api/operators` - Listar operadores
- `PUT /api/operators/{id}` - Atualizar operador
- `DELETE /api/operators/{id}` - Deletar operador

## 🔒 Segurança

- **JWT Authentication:** Todos os endpoints (exceto login) requerem token Bearer
- **Admin Secret:** Registro de novos operadores requer chave administrativa
- **CORS:** Configurado para aceitar origens específicas

## 📝 Próximos Passos

- [ ] Desenvolver frontend Next.js
- [ ] Implementar dashboard de métricas
- [ ] Adicionar templates de mensagens
- [ ] Sistema de agendamento de alertas
- [ ] Webhook para receber confirmações do WhatsApp

## 📚 Documentação

Documentação completa será expandida em breve com:
- Guia de deploy passo a passo
- Exemplos de uso da API
- Fluxos de autenticação
- Troubleshooting comum

## 🤝 Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com o time de desenvolvimento.

## 📄 Licença

Propriedade de JRF SecureNotify. Todos os direitos reservados.

---

**Desenvolvido com ❤️ usando Azure Functions e WhatsApp Cloud API**
