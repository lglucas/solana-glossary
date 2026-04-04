# Planejamento de Sprints — Solana Glossary Competition

> Autor: Lucas Galvao | Projeto: Solana Glossary Games
> Versionamento: Semantic Versioning (MAJOR.MINOR.PATCH)
> Cada sprint gera um bump de versao no CHANGELOG.md

---

## Sprint 0 — Fundacao (v0.1.0)
**Objetivo:** Planejamento completo, fork, estrutura de repositorio
- [x] Fork do repo solanabr/solana-glossary
- [x] Configuracao de remotes (origin + upstream)
- [x] Criacao de branches (feat/escape-room-solana, feat/jogo-da-vida-solana)
- [x] Questionario estrategico preenchido (20 decisoes documentadas)
- [x] Definicao dos 3 temas do Escape Room e 3 tabuleiros do Jogo da Vida
- [x] Definicao de stack: Vite + React 18 + TypeScript + Tailwind CSS
- [x] Documento de decisoes completo (docs/decisions.md)
- [x] Regras de desenvolvimento estabelecidas (CLAUDE.md)

## Sprint 1 — Prototipagem Visual (v0.2.0)
**Objetivo:** Prototipos de UI para validacao antes de implementar
- [ ] Scaffold Vite + React + TS + Tailwind
- [ ] Instalacao do SDK @stbr/solana-glossary
- [ ] 4 paginas de prototipo (escape-genesis, escape-defi, vida-normie, vida-startup)
- [ ] Teste de tipografia, paletas, layouts, animacoes, componentes
- [ ] Build e lint passando sem erros
- [ ] Avaliacao do Lucas e escolha das melhores tecnicas

## Sprint 2 — Arquitetura Base (v0.3.0) ✓
**Objetivo:** Estrutura compartilhada entre os dois jogos
- [x] Landing pages independentes por projeto
- [x] Setup Supabase (schema documentado, .env.local configurado)
- [x] Integracao wallet-adapter-react (Phantom + Solflare)
- [x] Setup react-i18next com pt-BR e es
- [x] Componentes base (layout, navbar)
- [x] Setup Howler.js (sistema de audio)
- [ ] Sistema de login wallet → nickname + avatar (Sprint 10)

## Sprint 3 — Escape Room: Engine Core (v0.4.0) ✓
**Objetivo:** Motor do jogo Escape Room funcionando
- [x] Sistema de temas e niveis (modular) — engine/themes.ts
- [x] Timer com contagem regressiva — hooks/useTimer.ts
- [x] Sistema de dicas (Surface → Consensus) — hooks/useHints.ts
- [x] Sistema de pontuacao — hooks/useScore.ts
- [x] Tela de resultado (vitoria/derrota) — pages/GameResult.tsx
- [x] Integracao SDK: getTermsByCategory(), getLocalizedTerms() — lib/glossary.ts
- [x] Pagina de selecao de temas — pages/ThemeSelect.tsx
- [x] Gameplay funcional (quiz multiple-choice) — pages/GamePlay.tsx

## Sprint 4 — Escape Room: 12 Puzzles (v0.5.0)
**Objetivo:** Todos os 12 formatos de puzzle implementados
- [ ] Tema 1 "O Bloco Genesis" — 4 puzzles (Surface a Consensus)
- [ ] Tema 2 "O Cofre DeFi" — 4 puzzles (Surface a Consensus)
- [ ] Tema 3 "O Laboratorio do Dev" — 4 puzzles (Surface a Consensus)
- [ ] Conteudo curado: termos fixos + 3x variacoes por puzzle
- [ ] i18n de todo o conteudo (pt-BR + es)

## Sprint 5 — Escape Room: Polish (v0.6.0)
**Objetivo:** Acabamento profissional do Escape Room
- [ ] Musica 8-bit/16-bit por tema (Howler.js)
- [ ] Efeitos sonoros (acerto, erro, timer, vitoria, derrota)
- [ ] Animacoes Framer Motion (transicoes, puzzles, feedback)
- [ ] Estetica Solana-branded finalizada
- [ ] Responsividade (mobile + desktop)
- [ ] Testes de usabilidade

## Sprint 6 — Jogo da Vida: Engine Core (v0.7.0)
**Objetivo:** Motor do Jogo da Vida funcionando
- [ ] Sistema de tabuleiro (~50 casas) modular
- [ ] Dado virtual com animacao
- [ ] Sistema de turnos (2-8 jogadores)
- [ ] Cartas de evento com termos do SDK
- [ ] Mini-desafios em casas especiais
- [ ] Quiz rapido (proporcao menor)
- [ ] Integracao SDK: searchTerms(), getLocalizedTerms()

## Sprint 7 — Jogo da Vida: Multiplayer Online (v0.8.0)
**Objetivo:** Multiplayer via internet funcionando
- [ ] Supabase Realtime: criacao de sala
- [ ] Geracao de link/QR code de convite
- [ ] Sincronizacao de estado entre jogadores
- [ ] Coordenacao de turnos em tempo real
- [ ] Tratamento de desconexao (jogador sai = perde pontuacao)
- [ ] Lobby de espera pre-jogo

## Sprint 8 — Jogo da Vida: 3 Tabuleiros (v0.9.0)
**Objetivo:** Os 3 tabuleiros completos com conteudo
- [ ] Tabuleiro 1 "De Normie a Validator" — visual Futurista/Neon, 50 casas
- [ ] Tabuleiro 2 "Startup Solana" — visual Matrix, 50 casas
- [ ] Tabuleiro 3 "A Timeline" — visual Pixel Art, 50 casas
- [ ] Conteudo curado por tabuleiro (eventos, desafios, quiz)
- [ ] i18n de todo o conteudo (pt-BR + es)

## Sprint 9 — Jogo da Vida: Polish (v0.10.0)
**Objetivo:** Acabamento profissional do Jogo da Vida
- [ ] Animacoes por tabuleiro (particulas, confetti, shake, transicoes)
- [ ] Efeitos sonoros (dado, avancar, voltar, evento, vitoria)
- [ ] 3 estilos visuais finalizados e distintos
- [ ] Responsividade (mobile + desktop)
- [ ] Testes de usabilidade

## Sprint 10 — Leaderboard e Integracao (v0.11.0)
**Objetivo:** Sistema de ranking e integracao final
- [ ] Leaderboard por jogo (Escape Room + Jogo da Vida)
- [ ] Leaderboard geral (soma dos dois jogos)
- [ ] Perfil do jogador (nickname, avatar, historico)
- [ ] Landing page final com navegacao entre jogos
- [ ] Testes end-to-end

## Sprint 11 — Deploy e QA (v0.12.0)
**Objetivo:** Deploy em producao e garantia de qualidade
- [ ] Build otimizado (Vite production)
- [ ] Deploy no aceleradora.eco.br via cPanel
- [ ] Testes em producao (mobile + desktop + wallets)
- [ ] Correcao de bugs encontrados
- [ ] Performance audit (Lighthouse)
- [ ] SSL/HTTPS verificado

## Sprint 12 — Submissao e Documentacao Final (v1.0.0)
**Objetivo:** PRs prontos, documentacao completa, submissao na competicao
- [ ] PR #1: feat/escape-room-solana → solanabr/solana-glossary
- [ ] PR #2: feat/jogo-da-vida-solana → solanabr/solana-glossary
- [ ] README.md por projeto (descricao, screenshots, setup, demo link)
- [ ] Deep dive writeup (bonus da competicao)
- [ ] Video walkthrough (bonus da competicao)
- [ ] Submissao no Superteam Earn com links dos PRs
- [ ] Post no Twitter mencionando @superaborasolana

---

## Resumo de Versoes

| Sprint | Versao | Marco |
|--------|--------|-------|
| 0 | v0.1.0 | Planejamento completo |
| 1 | v0.2.0 | Prototipos visuais |
| 2 | v0.3.0 | Arquitetura base + auth |
| 3 | v0.4.0 | Escape Room engine |
| 4 | v0.5.0 | 12 puzzles implementados |
| 5 | v0.6.0 | Escape Room polido |
| 6 | v0.7.0 | Jogo da Vida engine |
| 7 | v0.8.0 | Multiplayer online |
| 8 | v0.9.0 | 3 tabuleiros completos |
| 9 | v0.10.0 | Jogo da Vida polido |
| 10 | v0.11.0 | Leaderboard + integracao |
| 11 | v0.12.0 | Deploy + QA |
| 12 | v1.0.0 | Submissao final |
