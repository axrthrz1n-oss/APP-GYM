<div align="center">

<img src="icons/icon-192.png" width="96" alt="Ícone do app: halter pegando fogo">

# Ficha de Treino

**Ficha de musculação para o celular, com registro de cargas, progressão automática, calendário e sequência de dias treinados.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

[**Abrir o app**](https://axrthrz1n-oss.github.io/APP-GYM/)

</div>

---

## Sobre o projeto

A **Ficha de Treino** substitui a ficha de papel da academia. Ela mostra o treino do dia, guarda a carga e as repetições de cada série e, a partir desses registros, sugere a carga de cada série, diz quando subir, mostra a evolução treino a treino e acompanha a frequência ao longo do ano. O próprio treino pode ser montado e alterado dentro do app.

O app inteiro é **um único arquivo HTML**, escrito em **HTML, CSS e JavaScript puros**, sem frameworks, sem bibliotecas e sem etapa de build. Ele funciona direto no navegador, pode ser instalado na tela inicial do celular como um app (PWA) e continua funcionando sem internet.

## Capturas de tela

| Treino do dia | Descanso | Histórico com evolução |
|:---:|:---:|:---:|
| <img src="docs/treino.png" width="240" alt="Tela do treino do dia com sugestões por série"> | <img src="docs/descanso.png" width="240" alt="Cronômetro de descanso"> | <img src="docs/historico.png" width="240" alt="Histórico do exercício com porcentagem de evolução"> |

| Anotações | Treino finalizado | Editor de treino |
|:---:|:---:|:---:|
| <img src="docs/anotacoes.png" width="240" alt="Campo de anotações no fim do treino"> | <img src="docs/finalizado.png" width="240" alt="Resumo do treino finalizado"> | <img src="docs/editor.png" width="240" alt="Editor de treino"> |

| Calendário e visão do ano | Foguinho | Análise |
|:---:|:---:|:---:|
| <img src="docs/calendario.png" width="240" alt="Calendário com a visão do ano"> | <img src="docs/foguinho.png" width="240" alt="Painel do foguinho"> | <img src="docs/analise.png" width="240" alt="Aba de análise"> |

> As capturas usam dados de demonstração.

## Funcionalidades

### Registro do treino
- Divisão semanal **Push / Pull A / Legs / Push / Pull B**, de segunda a sexta, com abdômen às segundas, quartas e sextas. Tudo isso pode ser mudado no editor.
- Para cada série: **carga, repetições e o que foi feito da última vez** na mesma série.
- O botão **✓** marca a série como feita. Com os campos vazios, ele repete os valores do último treino.
- **Cronômetro de descanso** que começa sozinho ao marcar a série, com ajuste de ±15 s e aviso sonoro no fim.
- **Resumo do dia** com séries feitas, volume (kg × repetições) comparado ao último treino igual, e tempo de treino.
- **Tempo estimado** de cada treino, calculado a partir das séries e dos descansos.

### Sugestões série a série
Todas as sugestões consideram **carga e repetições juntas**, pela força estimada da série (fórmula de Epley: carga × (1 + repetições ÷ 30)).
- **1ª série:** faixa de carga calculada a partir da melhor série pesada: 70–80% nos compostos, 80–90% nos isolados e 60–70% no primeiro exercício do dia, que serve de aquecimento.
- **2ª série:** carga do dia com base no último treino (subir, manter ou baixar). Sem histórico, estima pela 1ª série de hoje.
- **3ª série:** ajusta pela 2ª que acabou de ser feita, já contando que costuma sair uma repetição a menos por causa do cansaço.
- Quadro **"Hoje" / "Próximo treino"** em cada exercício, com quanto subir ou baixar.
- Marcação de **recorde (PR)** quando uma carga nova é a maior já registrada no exercício.

### Histórico com evolução
- Cada exercício mostra os últimos treinos com a **porcentagem de melhora** em relação ao anterior (verde quando sobe, vermelho quando cai) e a evolução total desde o primeiro registro.

### Anotações
- Campo no fim de cada treino para registrar dores, desconfortos ou qualquer observação. As anotações entram na análise.

### Treino finalizado
- Ao marcar a última série do dia, abre um resumo com tempo, volume, recordes batidos e a lista de exercícios em que a carga deve subir no próximo treino.

### Foguinho (sequência de dias)
- Conta os **dias seguidos de treino**. Sábado, domingo e dias sem treino planejado contam como descanso e mantêm a sequência.
- Um dia de treino sem registro apaga o foguinho, a não ser que seja usada uma **restauração**: são 3 por mês, que renovam todo dia 1º e não acumulam.
- O ícone é um halter pegando fogo: aceso e laranja enquanto a sequência está viva, cinza quando apaga.

### Calendário
- **Visão do ano** no estilo mapa de calor, com os 12 meses e os números do ano: treinos, frequência, volume total e maior sequência.
- **Semanas** com os dias treinados, faltas, descansos e dias restaurados.
- **Semana leve (deload)**: a cada 6 ou 8 semanas, uma semana inteira com 2 séries por exercício, parando 2 a 3 repetições antes da falha. O treino do dia se adapta sozinho, e esses treinos não entram como referência de progressão.

### Editor de treino
- Monta os treinos e escolhe o treino de cada dia da semana (ou descanso).
- Para cada exercício: nome, composto ou isolado, número de séries, descanso e uma dica. Dá para adicionar, remover e reordenar.
- Um complemento opcional (como o abdômen) entra no fim dos dias marcados.
- Trocar o nome de um exercício mantém o histórico dele.

### Análise
- Monta um texto pronto com o plano, os registros e as anotações para colar no Claude ou em qualquer assistente.
- **Backup** dos registros, do plano e das configurações em JSON, com exportação e importação.

### Personalização
- **Cor principal** com 8 opções prontas ou qualquer cor personalizada.
- **Modo claro e escuro** automáticos, seguindo o sistema.

### Recursos extras quando publicado como artifact no Claude
- **Ranking entre amigos** convidados para a mesma ficha, comparando foguinho, treinos no mês, frequência e evolução. As cargas de cada um continuam privadas.
- **Resposta automática às anotações**, logo abaixo do campo, com espaço para perguntas de acompanhamento.
- **Análise em conversa** com o modelo e registros salvos na conta, sincronizados entre aparelhos.

## Tecnologias

| Área | O que foi usado |
|---|---|
| Linguagens | HTML5, CSS3 e JavaScript (ES2020), sem frameworks nem build |
| Layout | CSS Grid, Flexbox, variáveis CSS, `color-mix()` e `prefers-color-scheme` |
| Dados | `localStorage`, com exportação e importação de backup em JSON |
| App instalável | Web App Manifest e Service Worker (funciona offline) |
| APIs do navegador | Web Audio (bipe do descanso), Clipboard, Web Share e Vibration |
| Fontes | Barlow e Barlow Condensed (Google Fonts) |
| Integração opcional | Runtime de artifacts do Claude (`window.claude`) para salvar na conta e usar a análise com o modelo |

## Como usar

### Direto no navegador
Abra o `index.html`. Para o modo offline funcionar, sirva a pasta por HTTP:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

### Publicar no GitHub Pages
1. Suba os arquivos para um repositório público.
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. O app fica disponível em `https://axrthrz1n-oss.github.io/APP-GYM/`.

### Instalar no celular
- **iPhone (Safari):** Compartilhar → **Adicionar à Tela de Início**.
- **Android (Chrome):** menu ⋮ → **Instalar app** ou **Adicionar à tela inicial**.

O app abre em tela cheia, com ícone próprio, e funciona sem internet.

## Estrutura do projeto

```
ficha-de-treino/
├── index.html            # o app inteiro: HTML, CSS e JavaScript
├── manifest.webmanifest  # nome, cores e ícones do app instalável
├── sw.js                 # service worker (cache para uso offline)
├── icons/                # ícones do app (180, 192 e 512 px)
├── docs/                 # capturas de tela do README
├── LICENSE
└── README.md
```

## Como os dados são salvos

- **Fora do Claude:** tudo fica no `localStorage` do navegador do próprio aparelho, nas chaves `ficha-treino-v1` (treinos e anotações), `ficha-plan-v1` (plano montado no editor) e `ficha-config-v1` (semanas leves, restaurações e cor). Nada é enviado para servidor nenhum. Use **Análise → Exportar backup** de vez em quando.
- **Publicado como artifact no Claude:** os registros ficam salvos na conta do usuário, em uma área privada, e sincronizam entre o celular e o computador.

## Personalizar o treino

O jeito mais fácil é pelo próprio app: toque em **Editar treino**, no card do dia. O plano montado ali fica salvo no aparelho e entra no backup.

O treino que vem de fábrica fica nas constantes `WORKOUTS`, `DAYS` e `EXTRA`, no início do `<script>` do `index.html`:

```js
push: {name:"Push", exercises:[
  {id:"supino-inclinado", name:"Supino inclinado máquina", sets:A(3), ...HEAVY},
  {id:"crossover", name:"Crossover", sets:A(3), ...LIGHT, tip:"Puxar de cima para baixo"},
  // ...
]}
```

- `A(n)`: n séries no esquema de compostos (1ª de 10–12 repetições, as outras até 8, até a falha).
- `B(n)`: n séries no esquema de isolados (1ª de 12–15, as outras de 10–12).
- `HEAVY` e `LIGHT`: descanso de 2–3 min ou de 1–1,5 min.
- `id`: identificador fixo do exercício. Mudar o `id` faz o exercício perder o histórico.

## Regras de progressão

A ficha calcula a força estimada da **série pesada mais fraca** e procura a carga que daria a meta de repetições. O ajuste é arredondado em degraus de 1 kg (abaixo de 10 kg), 2,5 kg (de 10 a 60 kg) ou 5 kg (acima de 60 kg).

| Situação nas séries pesadas | O que a ficha sugere |
|---|---|
| Bateu a meta de repetições em todas | Subir de 1 a 3 degraus, conforme quanto passou da meta |
| Ficou dentro da faixa | Manter a carga e buscar mais repetições |
| Ficou abaixo de 5 (compostos) ou 8 (isolados) | Baixar de 1 a 3 degraus |

## Aviso

Este projeto é uma ferramenta de registro e organização. Ele não substitui a orientação de um profissional de educação física ou de saúde.

## Autor

Desenvolvido por **Arthur Ferraz de Aquino**, estudante de Ciência da Computação, com auxílio do Claude (Anthropic).

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
