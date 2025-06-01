# Guia de Implantação com GitHub, Coolify e Docker

Este guia explica como implantar o aplicativo de Fluxo de Trabalho de Conteúdo usando GitHub, Coolify e Docker.

## 1. Preparação do GitHub

1. Crie um novo repositório no GitHub
2. Inicialize o repositório local e faça o primeiro commit:

```bash
cd content-workflow-app
git init
git add .
git commit -m "Commit inicial"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

## 2. Configuração do Coolify

### Pré-requisitos
- Conta no Coolify
- Servidor configurado no Coolify

### Passos para implantação

1. Faça login no painel do Coolify
2. Crie um novo serviço
3. Selecione "GitHub" como fonte
4. Conecte sua conta GitHub e selecione o repositório
5. Configure o serviço:
   - Tipo de implantação: Docker
   - Dockerfile: `/Dockerfile` (caminho para o Dockerfile no repositório)
   - Porta: `5173`
   - Variáveis de ambiente:
     - `OPENAI_API_KEY`: Sua chave da API da OpenAI

6. Configure os recursos (CPU, memória) conforme necessário
7. Clique em "Implantar"

## 3. Implantação Manual com Docker

Se preferir implantar manualmente usando Docker:

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` e adicione sua chave da API da OpenAI:
```
OPENAI_API_KEY=sua_chave_da_api_aqui
```

4. Construa a imagem Docker:
```bash
docker build -t content-workflow-app .
```

5. Execute o container:
```bash
docker run -p 5173:5173 --env-file .env content-workflow-app
```

6. Acesse o aplicativo em `http://localhost:5173`

## 4. CI/CD com GitHub Actions (Opcional)

Para configurar CI/CD com GitHub Actions, crie um arquivo `.github/workflows/deploy.yml` com o seguinte conteúdo:

```yaml
name: Deploy to Coolify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify Deployment
        uses: fjogeleit/http-request-action@v1
        with:
          url: ${{ secrets.COOLIFY_WEBHOOK_URL }}
          method: 'POST'
```

Configure o webhook URL nas configurações do seu repositório GitHub em Settings > Secrets > Actions > New repository secret:
- Nome: COOLIFY_WEBHOOK_URL
- Valor: URL do webhook fornecido pelo Coolify

## 5. Considerações de Segurança

- Nunca armazene sua chave da API da OpenAI diretamente no código
- Use sempre variáveis de ambiente para credenciais
- Configure HTTPS para proteger a comunicação com a API da OpenAI
- Considere adicionar autenticação ao aplicativo se for usado em ambiente de produção

## 6. Solução de Problemas

- **Erro de conexão com a API da OpenAI**: Verifique se a variável de ambiente OPENAI_API_KEY está configurada corretamente
- **Aplicativo não inicia**: Verifique os logs do Docker com `docker logs [container-id]`
- **Problemas de build**: Verifique se todas as dependências estão listadas no package.json
