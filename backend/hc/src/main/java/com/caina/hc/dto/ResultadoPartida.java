package com.caina.hc.dto;

// Formato que o front manda ao registrar o placar de uma partida da rodada atual.
// vencedorId só é obrigatório em partidas de mata-mata que terminam empatadas
// (decidido nos pênaltis); na fase de grupos e em partidas com vencedor claro
// no placar, vem nulo e é ignorado/calculado sozinho.
public record ResultadoPartida(int id, int placarCasa, int placarVisitante, Integer vencedorId) {
}
