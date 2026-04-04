# Questionario Estrategico - Projetos Solana Glossary

> Respostas preenchidas em 2026-04-03.

---

## PROJETO 1 — ESCAPE ROOM SOLANA

### Narrativa e Tema

**1.1** O escape room original era sobre cypherpunks e Bitcoin. Qual narrativa pro novo?

**Resposta:** Estrutura modular por temas. Varios temas independentes, cada um com fases de dificuldade crescente. Dentro de cada fase, enigmas + dicas que montam puzzles para obter as respostas.

**1.2** Quantas estacoes/desafios?

**Resposta:** 3 temas × 4 niveis de dificuldade = 12 desafios no lancamento. Modular: novos temas e niveis podem ser adicionados. O numero de niveis por tema e flexivel (nao precisa ser sempre 4).

**1.3** Sistema de dificuldade?

**Resposta:** Dificuldade gradual dentro de cada tema, usando metafora Solana "profundidade no bloco":
- **Nivel 1 — Surface**: termos basicos, mais tempo, mais dicas
- **Nivel 2 — Confirmation**: termos intermediarios, tempo moderado, menos dicas
- **Nivel 3 — Finality**: termos avancados, tempo curto, dicas minimas
- **Nivel 4 — Consensus**: mix de todos os niveis, sem dicas, tempo apertado

### Tipos de Puzzles (usando o SDK)

**1.4** Que tipos de puzzle?

**Resposta:** 12 estilos DIFERENTES de puzzle — cada nivel de cada tema e um formato distinto. Maxima variedade criativa para demonstrar expansao. Todas as opcoes (A-F) e mais.

**1.5** Puzzles aleatorios ou fixos?

**Resposta:** Fixos/curados manualmente para garantir qualidade, mas com 3x mais variacoes pre-programadas para dar sensacao de aleatoriedade. Ex: se um desafio usa 20 termos, ter 60 prontos, sorteando 20 a cada sessao.

### Visual e UX

**1.6** Estetica?

**Resposta:** **(B)** Solana-branded all-the-way. Gradientes roxo/verde/azul do ecossistema Solana.

**1.7** Efeitos sonoros / musica?

**Resposta:** Sim. Musica 8-bit/16-bit com vibe dramatico/suspense/tempo se esgotando. Estilo escape room.

**1.8** Deploy?

**Resposta:** Deploy no aceleradora.eco.br via cPanel (com suporte Node.js). Instrucoes em docs/DEPLOY-CPANEL.md.

### i18n e Bonus

**1.9** i18n?

**Resposta:** Sim, obrigatorio. pt-BR e es (espanhol). Desde o inicio.

**1.10** Leaderboard?

**Resposta:** Sim, com Supabase + Connect Wallet Solana como login. Nickname + foto/avatar vinculados a wallet. Leaderboard visual caprichado, tanto por jogo quanto geral (soma dos dois jogos).

---

## PROJETO 2 — JOGO DA VIDA SOLANA

### Narrativa e Tema

**2.1** Qual jornada narrativa?

**Resposta:** 3 tabuleiros independentes, cada um com narrativa diferente, para alcancar publico-alvo mais amplo:
- **Tabuleiro 1:** "De Normie a Validator" — jornada pessoal no ecossistema Solana
- **Tabuleiro 2:** "Startup Solana" — construir uma startup no ecossistema
- **Tabuleiro 3:** "A Timeline" — viagem pela historia real da Solana

**2.2** Quantas casas?

**Resposta:** ~50 casas por tabuleiro. Jogadas podem avancar ou voltar. Modular: novos tabuleiros podem ser lancados.

**2.3** Formato multiplayer?

**Resposta:** Multiplayer online real via Supabase Realtime. Jogador 1 gera link/QR code de convite. 2-8 jogadores, cada um conecta wallet Solana. Turnos coordenados pelo sistema. Ambos os jogos compartilham mesma landing page com login unificado.

### Mecanicas de Jogo (usando o SDK)

**2.4** Como integrar o glossario no gameplay?

**Resposta:** Por prioridade:
1. **(B)** Cartas de evento com termos reais como contexto narrativo (maior proporção)
2. **(C)** Mini-desafios rapidos em casas especiais
3. **(A)** Quiz por casa (proporcao menor)

**2.5** Cartas/eventos aleatorios ou fixos?

**Resposta:** Fixos/curados manualmente com grande volume para parecer aleatorio (mesma logica do Projeto 1).

### Visual e UX

**2.6** Estetica do tabuleiro?

**Resposta:** 3 estilos visuais DISTINTOS, todos com animacoes:
- **Tabuleiro 1:** Futurista/Neon + Animacoes (estilo cyberpunk)
- **Tabuleiro 2:** Matrix + Animacoes (chuva de caracteres verde)
- **Tabuleiro 3:** Pixel Art + Animacoes (retro 8-bit)

**2.7** Animacoes?

**Resposta:** Sim, tudo. Particulas, confetti, shake, transicoes cinematicas, e mais o que puder enriquecer a experiencia.

**2.8** Deploy?

**Resposta:** Deploy no aceleradora.eco.br via cPanel (mesmo do Projeto 1).

### i18n e Bonus

**2.9** i18n?

**Resposta:** Sim. pt-BR e es. Desde o inicio.

**2.10** Save/resume de partida?

**Resposta:** Nao. Saiu no meio = perde pontuacao. Estilo anos 80 raiz.

---

## PERGUNTAS TRANSVERSAIS

**T.1** Stack?

**Resposta:** Vite + React 18 + TypeScript + Tailwind CSS. Deploy estatico (dist/) no cPanel. Supabase para backend (auth, realtime, leaderboard). Bibliotecas: @solana/wallet-adapter-react, react-i18next, Howler.js, Framer Motion, SweetAlert2.

**T.2** shadcn/ui ou custom?

**Resposta:** Criar prototipo visual com 4 paginas de teste (jogo1-tema1, jogo1-tema2, jogo2-tabuleiro1, jogo2-tabuleiro2) com diferencas profundas entre cada uma para avaliar melhores tecnicas e componentes antes de implementar.

**T.3** Tempo?

**Resposta:** Sem restricao. Execucao intensiva via Claude Code.

**T.4** Fork e documentacao?

**Resposta:** Fork feito: github.com/lglucas/solana-glossary. Regras de ouro: cabecalho em cada arquivo, documentacao inline, separation of concerns, max 200 linhas por arquivo. Tudo bem documentado.
