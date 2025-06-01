# Aplicativo de Fluxo de Trabalho de Conteúdo

Este aplicativo React implementa um fluxo de trabalho para geração de conteúdo de marketing usando a API da OpenAI. O aplicativo guia o usuário por 6 etapas diferentes para criar diversos tipos de conteúdo, desde a definição do perfil de cliente ideal até a geração de assets para redes sociais.

## Requisitos

- Node.js (versão 16 ou superior)
- pnpm (gerenciador de pacotes)
- Chave de API da OpenAI

## Instalação e Execução Local

1. Clone o repositório
2. Instale as dependências:

```bash
pnpm install
```

3. Crie um arquivo `.env` baseado no `.env.example` e adicione sua chave da API da OpenAI:

```
OPENAI_API_KEY=sua_chave_da_api_aqui
```

4. Execute o aplicativo:

```bash
pnpm run dev
```

## Implantação com Docker, GitHub e Coolify

Este projeto está configurado para implantação usando Docker, GitHub e Coolify. Consulte o arquivo [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas sobre como:

- Configurar o repositório no GitHub
- Implantar o aplicativo usando Coolify
- Executar o aplicativo em containers Docker
- Configurar CI/CD com GitHub Actions

## Estrutura do Projeto

- `src/App.tsx`: Componente principal com o fluxo de trabalho de conteúdo
- `src/components/ui/`: Componentes de UI do shadcn
- `Dockerfile`: Configuração para ambiente de desenvolvimento
- `Dockerfile.prod`: Configuração otimizada para ambiente de produção
- `nginx.conf`: Configuração do Nginx para servir o aplicativo em produção
- `.env.example`: Exemplo de variáveis de ambiente necessárias

## Funcionalidades

O aplicativo implementa um fluxo de trabalho de 6 etapas para geração de conteúdo:

1. **Perfil de Cliente Ideal (ICP)**: Define o perfil do cliente ideal com informações sobre indústria, tamanho da empresa, dores e região.

2. **Temas do Target**: Identifica tópicos de interesse, eventos sazonais e palavras-chave prioritárias.

3. **Pesquisa Profunda**: Realiza análise aprofundada sobre temas específicos.

4. **Post Pilar para Blog**: Gera conteúdo otimizado para SEO com base em palavras-chave.

5. **Pauta de Redes Sociais**: Cria um calendário de conteúdo para redes sociais.

6. **Assets de Texto e Imagem**: Gera copy final e prompts para criação de imagens.

## Tecnologias utilizadas

- React
- TypeScript
- shadcn/ui (componentes UI)
- Framer Motion (animações)
- OpenAI API (geração de conteúdo)
- Docker (containerização)
- Nginx (servidor web para produção)
# workflow
# workflow
