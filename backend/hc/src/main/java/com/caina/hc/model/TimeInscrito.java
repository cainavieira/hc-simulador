package com.caina.hc.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class TimeInscrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotEmpty
    @Column(unique = true)
    private String nomeJogador;

    @NotEmpty
    @Column(unique = true)
    private String timeJogador;

    @NotEmpty
    private String codigoPais;

    public TimeInscrito(String nome, String time, String codigo) {
        this.nomeJogador = nome;
        this.timeJogador = time;
        this.codigoPais = codigo;
    }
}
