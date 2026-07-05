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

    private String grupo;
    private int rodada;

    // Guardamos só o id do TimeInscrito (sem @ManyToOne) pra manter simples —
    // o front já busca os TimeInscritos completos e cruza pelo id.
    private int timeCasaId;
    private int timeVisitanteId;

    // Nulos até a rodada ser jogada e o placar ser registrado.
    private Integer placarCasa;
    private Integer placarVisitante;

    public Partida(String grupo, int rodada, int timeCasaId, int timeVisitanteId) {
        this.grupo = grupo;
        this.rodada = rodada;
        this.timeCasaId = timeCasaId;
        this.timeVisitanteId = timeVisitanteId;
    }
}
