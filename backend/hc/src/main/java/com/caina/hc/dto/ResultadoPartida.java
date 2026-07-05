package com.caina.hc.dto;

// Formato que o front manda ao registrar o placar de uma partida da rodada atual.
public record ResultadoPartida(int id, int placarCasa, int placarVisitante) {
}
