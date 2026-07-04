package com.caina.hc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.caina.hc.model.TimeInscrito;

public interface TimeInscritoRepository extends JpaRepository<TimeInscrito, Integer> {
    
    Optional<TimeInscrito> findByNomeJogador(String nomeJogador);
}
