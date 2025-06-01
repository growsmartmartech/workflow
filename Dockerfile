FROM node:20-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install

# Copiar código fonte
COPY . .

# Substituir a chave da API por variável de ambiente
RUN sed -i 's/const openaiApiKey = "OPENAI_KEY_AQUI";/const openaiApiKey = process.env.OPENAI_API_KEY || "";/' src/App.tsx

# Expor porta
EXPOSE 5173

# Comando para iniciar o aplicativo
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
