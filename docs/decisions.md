# Registro de Decisoes — Solana Glossary Competition

## Decisao 1 — Quantidade de projetos
- **Data:** 2026-04-03
- **Decisao:** 2 projetos (nao 3)
- **Motivo:** Lucas tem 2 creditos de submissao na plataforma Superteam Earn
- **Impacto:** Foco em qualidade > quantidade. Cada projeto precisa ser excelente.

## Decisao 2 — Quais projetos
- **Data:** 2026-04-03
- **Decisao:** Refazer os dois jogos educacionais existentes com tema Solana:
  1. **Escape Room** (baseado no "Operation Cypherpunk")
  2. **Jogo da Vida** (baseado no "Jogo da Vida da Startup")
- **Motivo:** Lucas ja tem experiencia comprovada com esses formatos (1413 e 999 linhas respectivamente). Refaze-los com acabamento de browser-game profissional e dados do SDK maximiza Creativity [25%] e Quality & Polish [25%].
- **Impacto:** Descartado o projeto de tooling agentivo (MCP/RAG) e o frontend puro do glossario.

## Decisao 3 — PRs separados
- **Data:** 2026-04-03
- **Decisao:** Cada jogo sera um PR independente no repo github.com/solanabr/solana-glossary
- **Motivo:** A competicao permite multiplas submissoes e o ranking e a soma de todas as contribuicoes. PRs separados = mais bonus.
- **Impacto:** Projetos devem ser 100% independentes entre si.

## Decisao 4 — Bibliotecas sob demanda
- **Data:** 2026-04-03
- **Decisao:** Bibliotecas sugeridas serao instaladas apenas onde fizerem sentido, nao em ambos projetos por padrao.
- **Motivo:** Evitar bloat e dependencias desnecessarias.

## Decisao 5 — Planejamento antes de execucao
- **Data:** 2026-04-03
- **Decisao:** Planejar inteiramente os dois projetos primeiro, depois executar.
- **Motivo:** Calibrar escopo, stack e prioridades antes de escrever codigo.

## Decisao 6 — Stack tecnica
- **Data:** 2026-04-03
- **Decisao:** Vite + React 18 + TypeScript + Tailwind CSS
- **Motivo:** Deploy estatico (dist/) no cPanel sem Node.js no servidor. Jogos sao 100% client-side. Supabase faz todo o backend (auth, realtime, leaderboard). Menos complexidade = menos bugs.
- **Bibliotecas:** @solana/wallet-adapter-react, react-i18next, Howler.js, Framer Motion, SweetAlert2

## Decisao 7 — Filosofia de design
- **Data:** 2026-04-03
- **Decisao:** Seguir a metodologia Experience Learning da Perestroika:
  - Conteudo autoral com tese original
  - Forma colaborativa (experiencia, nao pagina estatica)
  - Emocao (diversao e entretenimento)
  - Estrutura com arco narrativo

## Decisao 8 — Regras de desenvolvimento
- **Data:** 2026-04-03
- **Decisao:** Adaptar as 34 regras do instrucoes-master.md para este projeto.
- **Regras de ouro:** Cabecalho em cada arquivo, documentacao inline, separation of concerns, max 200 linhas por arquivo.

## Decisao 9 — Skills instaladas
- **Data:** 2026-04-03
- **Decisao:** 6 skills Claude Code: brand-guidelines, frontend-design, pptx, skill-creator, theme-factory, ui-ux-pro-max

## Decisao 10 — Estrutura modular do Escape Room
- **Data:** 2026-04-03
- **Decisao:** 3 temas × 4 niveis = 12 desafios iniciais. Cada nivel e um estilo de puzzle diferente (12 formatos distintos). Modular: novos temas/niveis podem ser adicionados.
- **Temas definidos:**
  - **Tema 1 "O Bloco Genesis"**: Core Protocol (86) + Blockchain General (84) + Network (58) + Infrastructure (44) = 272 termos
  - **Tema 2 "O Cofre DeFi"**: Token Ecosystem (59) + DeFi (135) + Web3 (80) + Solana Ecosystem (138) = 412 termos
  - **Tema 3 "O Laboratorio do Dev"**: Programming Model (69) + Dev Tools (64) + Programming Fundamentals (47) + Security (48) + ZK (34) + AI/ML (55) = 317 termos
- **Sistema de dificuldade (metafora "profundidade no bloco"):**
  - Surface → Confirmation → Finality → Consensus

## Decisao 11 — Estrutura do Jogo da Vida
- **Data:** 2026-04-03
- **Decisao:** 3 tabuleiros independentes, ~50 casas cada, 2-8 jogadores.
- **Tabuleiros definidos:**
  - **Tabuleiro 1 "De Normie a Validator"**: Futurista/Neon + Animacoes
  - **Tabuleiro 2 "Startup Solana"**: Matrix + Animacoes
  - **Tabuleiro 3 "A Timeline"**: Pixel Art + Animacoes
- **Mecanicas SDK:** Cartas de evento (principal) > Mini-desafios > Quiz (menor proporcao)
- **Sem save/resume:** Saiu no meio = perde pontuacao.

## Decisao 12 — Multiplayer online real
- **Data:** 2026-04-03
- **Decisao:** Jogo da Vida com multiplayer via internet usando Supabase Realtime.
- **Fluxo:** Jogador 1 gera link/QR code → outros conectam wallet Solana → 2-8 jogadores → turnos coordenados.
- **Impacto:** Ambos os jogos numa landing page unificada com login por wallet.

## Decisao 13 — Login e Leaderboard
- **Data:** 2026-04-03
- **Decisao:** Supabase + Connect Wallet Solana como login. Nickname + avatar vinculados. Leaderboard por jogo + geral (soma dos dois jogos).

## Decisao 14 — i18n obrigatorio
- **Data:** 2026-04-03
- **Decisao:** pt-BR e es desde o inicio em ambos os projetos. Usando react-i18next + dados do SDK (getLocalizedTerms).

## Decisao 15 — Deploy
- **Data:** 2026-04-03
- **Decisao:** Deploy no aceleradora.eco.br via cPanel. Build estatico (Vite dist/). Instrucoes base em docs/DEPLOY-CPANEL.md.

## Decisao 16 — Conteudo curado com variedade
- **Data:** 2026-04-03
- **Decisao:** Puzzles/eventos fixos curados manualmente, mas com 3x mais variacoes pre-programadas para sensacao de aleatoriedade.
- **Motivo:** Qualidade garantida + rejogabilidade.

## Decisao 17 — Audio 8-bit/16-bit
- **Data:** 2026-04-03
- **Decisao:** Musica 8-bit/16-bit dramatica/suspense para Escape Room. Efeitos sonoros em ambos os jogos. Biblioteca: Howler.js.

## Decisao 18 — Estetica visual
- **Data:** 2026-04-03
- **Decisao:**
  - **Escape Room:** Solana-branded (gradientes roxo/verde/azul)
  - **Jogo da Vida:** 3 estilos distintos (Futurista/Neon, Matrix, Pixel Art)

## Decisao 19 — Fork e branches
- **Data:** 2026-04-03
- **Decisao:** Fork em github.com/lglucas/solana-glossary. Branches: feat/escape-room-solana e feat/jogo-da-vida-solana. Cada branch vira um PR para solanabr/solana-glossary.

## Decisao 20 — Prototipo visual antes de implementar
- **Data:** 2026-04-03
- **Decisao:** Criar pagina temporaria com 4 rotas de teste (jogo1-tema1, jogo1-tema2, jogo2-tabuleiro1, jogo2-tabuleiro2) para avaliar diferencas profundas de UI/UX antes da implementacao final.

---

## Todas as decisoes pendentes foram resolvidas em 2026-04-03.
