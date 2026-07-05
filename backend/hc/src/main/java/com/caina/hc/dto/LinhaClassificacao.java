package com.caina.hc.dto;

import com.caina.hc.model.TimeInscrito;

import lombok.Data;

// Uma linha da tabela de classificação de um grupo. Pts/J/V/E/D/GP/GC são
// acumulados partida a partida; SG (saldo de gols) é sempre calculado
// (gp - gc), nunca guardado à parte.
@Data
public class LinhaClassificacao {

    private final TimeInscrito time;
    private int pontos = 0;
    private int jogos = 0;
    private int vitorias = 0;
    private int empates = 0;
    private int derrotas = 0;
    private int gp = 0;
    private int gc = 0;

    public LinhaClassificacao(TimeInscrito time) {
        this.time = time;
    }

    public int getSg() {
        return gp - gc;
    }
}
