# Aula de hoje: colocando o projeto Petshop para rodar

## 1) Crie sua cópia do repositório no GitHub (fork)

1. Entre na sua conta do GitHub.
2. Acesse: https://github.com/renato-mauro/petshop
3. No canto superior direito, clique em **Fork** e depois em **Create fork**.

Agora você tem uma cópia do projeto na sua conta, em um endereço assim:
`https://github.com/SEU-USUARIO/petshop`

## 2) Clone o repositório no seu computador (Git Bash)

1. Abra o **Git Bash**.
2. Vá para a Área de Trabalho:

```bash
cd ~/Desktop
```

3. Clone o **seu** repositório (troque `SEU-USUARIO` pelo seu usuário do GitHub):

```bash
git clone https://github.com/SEU-USUARIO/petshop.git
```

Vai aparecer uma pasta `petshop` na sua Área de Trabalho.

## 3) Abra a pasta no VS Code

1. No VS Code, vá em **File → Open Folder...** (Arquivo → Abrir Pasta...).
2. Escolha a pasta **`petshop`** que acabou de ser criada e clique em **Selecionar pasta**.

⚠️ **Atenção:** abra a **pasta `petshop` inteira**, e não arquivos soltos. Se você abrir só um arquivo, o VS Code não enxerga o resto do projeto e o terminal abre no lugar errado.

Para conferir: na barra lateral esquerda (Explorer) devem aparecer as pastas `petshop-api` e `petshop-frontend`.

## 4) Abra o terminal e rode a API

1. No VS Code, abra o terminal: menu **Terminal → New Terminal** (ou `` Ctrl + ` ``).
2. Rode os comandos abaixo, **um de cada vez**:

```bash
cd petshop-api
npm install
npm run dev
```

O `npm install` pode demorar um pouco na primeira vez: além das bibliotecas, ele baixa uma versão do Node.js só para este projeto (é normal).

Deu certo quando aparecer a mensagem:

```
API do petshop rodando em http://localhost:3001
```

**Não feche esse terminal.** A API precisa continuar rodando.

## 5) Abra uma nova aba do terminal e rode o site

1. No painel do terminal, clique no botão **+** para abrir um terminal novo.
2. Rode os comandos abaixo, **um de cada vez**:

```bash
cd petshop-frontend
npm install
npm run dev
```

Deu certo quando aparecer algo assim:

```
➜  Local:   http://localhost:5173/
```

3. Abra **http://localhost:5173** no navegador (ou segure `Ctrl` e clique no link que apareceu no terminal).

✅ Pronto! Você deve ver a página inicial do Petshop com os cards **Clientes** e **Serviços**. Entre em **Clientes** e tente cadastrar um cliente.

---

### Se der erro

- **`npm` não é reconhecido como comando:** o Node.js não está instalado. Instale a versão LTS em https://nodejs.org e depois **feche e abra o VS Code de novo**.- **Erro vermelho falando em "execução de scripts foi desabilitada" / `npm.ps1`:** o terminal está usando o PowerShell. Clique na setinha **˅** ao lado do **+** no terminal, escolha **Git Bash** e rode os comandos de novo.
- **A página abre, mas aparece "Não foi possível carregar os clientes":** o terminal da API (passo 4) foi fechado ou deu erro. Confira se ele ainda está rodando.
- **Para parar um servidor:** clique no terminal dele e aperte `Ctrl + C`.
