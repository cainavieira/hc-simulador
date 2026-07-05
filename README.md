# hc-simulador

Simulador da Copa do Mundo pra jogar com os amigos.

## Lembretes pro dia do jogo

- **Peça pra cada pessoa escolher o país com calma antes de confirmar.** Hoje, depois que alguém confirma o nome e o país, não dá pra voltar atrás e trocar de ideia pela própria tela, então vale avisar todo mundo antes de começar: "escolhe direito, porque depois não muda afinal é muito detalhe para programar".
  
- **Reinicie o backend antes de começar de verdade.** "Jogo iniciado" é um `boolean` em memória (`JogoService`), sem endpoint pra desligar de novo, uma vez que alguém aperta "Iniciar jogo" , todo mundo que se inscrever depois é jogado direto pra tela de grupos, pulando a tela de espera, até o processo do backend reiniciar. Fica registrado como pendência: seria bom ter um jeito de "reiniciar o jogo" sem precisar reiniciar o processo inteiro.
