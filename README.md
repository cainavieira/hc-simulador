# hc-simulador

Simulador da Copa do Mundo pra jogar com os amigos.

## Lembretes pro dia do jogo

- **Peça pra cada pessoa escolher o país com calma antes de confirmar.** Hoje, depois que alguém confirma o nome e o país, não dá pra voltar atrás e trocar de ideia pela própria tela, então vale avisar todo mundo antes de começar: "escolhe direito, porque depois não muda afinal é muito detalhe para programar".
  
- **O número de grupos só pode ser 1, 2, 4, 8 ou 16 e o total de inscritos precisa ser múltiplo dele.** São duas regras separadas: primeiro você escolhe quantos grupos vai ter, mas só esses 5 valores são aceitos (são os únicos que dividem 16 certinho, o tanto que sempre precisa se classificar pras oitavas). Depois disso, o total de inscritos precisa ser múltiplo do número escolhido (ex: 4 grupos exige um total múltiplo de 4, tipo 24 ou 28). Se o total não bater com nenhuma combinação válida, o sorteio recusa rodar pra qualquer número de grupos e trava o organizador. (Grupo com número ímpar de gente dentro dele é suportado normalmente — só o "total ÷ número de grupos" precisa fechar redondo, não precisa fechar par.)
- 
- **Reinicie o backend antes de começar de verdade.** "Jogo iniciado" é um `boolean` em memória (`JogoService`), sem endpoint pra desligar de novo, uma vez que alguém aperta "Iniciar jogo" , todo mundo que se inscrever depois é jogado direto pra tela de grupos, pulando a tela de espera, até o processo do backend reiniciar. Fica registrado como pendência: seria bom ter um jeito de "reiniciar o jogo" sem precisar reiniciar o processo inteiro.
