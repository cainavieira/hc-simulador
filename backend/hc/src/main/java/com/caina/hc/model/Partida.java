package com.caina.hc.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // "GRUPOS" ou "OITAVAS" (mais fases depois: quartas, semi, final).
    private String fase;

    // Nulo nas partidas de mata-mata (não tem grupo depois da fase de grupos).
    private String grupo;
    private int rodada;

    // Guardamos só o id do TimeInscrito (sem @ManyToOne) pra manter simples —
    // o front já busca os TimeInscritos completos e cruza pelo id.
    private int timeCasaId;
    private int timeVisitanteId;

    // Nulos até a rodada ser jogada e o placar ser registrado.
    private Integer placarCasa;
    private Integer placarVisitante;

    // Só usado no mata-mata: quem passa de fase. Nulo até decidido (placar
    // desempatado automaticamente decide; empate precisa de pênaltis, aí o
    // organizador escolhe manualmente quem venceu).
    private Integer vencedorId;

    public Partida(String fase, String grupo, int rodada, int timeCasaId, int timeVisitanteId) {
        this.fase = fase;
        this.grupo = grupo;
        this.rodada = rodada;
        this.timeCasaId = timeCasaId;
        this.timeVisitanteId = timeVisitanteId;
    }
}
