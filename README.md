# hc-simulador

Simulador da Copa do Mundo pra jogar com os amigos.

## Lembretes pro dia do jogo

- **Peça pra cada pessoa escolher o país com calma antes de confirmar.** Hoje, depois que alguém confirma o nome e o país, não dá pra voltar atrás e trocar de ideia pela própria tela, então vale avisar todo mundo antes de começar: "escolhe direito, porque depois não muda afinal é muito detalhe para programar".
  
- **O total de inscritos precisa ser PAR — mas não precisa mais ser múltiplo de 4.** O número de grupos só pode ser 1, 2, 4, 8 ou 16 (os únicos que dividem 16 certinho, o tanto que sempre precisa se classificar pras oitavas) — e o total de inscritos precisa ser múltiplo do número de grupos escolhido. Como 2/4/8/16 são todos pares, e um número ímpar nunca divide certinho por um par, **um total ímpar de inscritos nunca vai fechar** (trava o sorteio pra qualquer número de grupos). Já um total par funciona mesmo se não for múltiplo de 4: hoje cada grupo pode ter uma quantidade ímpar de gente dentro dele (ex: 28 pessoas em 4 grupos de 7 já foi testado e funciona — antes precisava ser múltiplo de 8 pra isso, não precisa mais).
- 
- **Reinicie o backend antes de começar de verdade.** "Jogo iniciado" é um `boolean` em memória (`JogoService`), sem endpoint pra desligar de novo, uma vez que alguém aperta "Iniciar jogo" , todo mundo que se inscrever depois é jogado direto pra tela de grupos, pulando a tela de espera, até o processo do backend reiniciar. Fica registrado como pendência: seria bom ter um jeito de "reiniciar o jogo" sem precisar reiniciar o processo inteiro.
