package com.caina.hc.service;


import org.springframework.stereotype.Service;

import com.caina.hc.model.TimeInscrito;
import com.caina.hc.repository.TimeInscritoRepository;

import jakarta.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class TimeInscritoService {

    private final TimeInscritoRepository timeInscritoRepository;

    public TimeInscritoService(TimeInscritoRepository timeInscritoRepository) {
        this.timeInscritoRepository = timeInscritoRepository;
    }

    public TimeInscrito saveTimeInscrito(TimeInscrito novoTimeInscrito) {
        return timeInscritoRepository.save(novoTimeInscrito);
    }

    public void deleteTimeById(int timeInscritoId) {
        if (!timeInscritoRepository.existsById(timeInscritoId)) {
            return;
        }
        timeInscritoRepository.deleteById(timeInscritoId);
    }

    public TimeInscrito getTimeInscritoById(int timeInscritoId) {
        return timeInscritoRepository.findById(timeInscritoId)
                .orElseThrow(() -> new RuntimeException());
    }

    public List<TimeInscrito> getTimesInscritos() {
        return timeInscritoRepository.findAll();
    }

    public TimeInscrito updateTimeInscrito(int novoInscritoId, TimeInscrito novoTimeInscrito) {
        if (!timeInscritoRepository.existsById(novoInscritoId)) {
            throw new RuntimeException();
        }
        novoTimeInscrito.setNomeJogador(novoTimeInscrito.getNomeJogador());
        novoTimeInscrito.setTimeJogador(novoTimeInscrito.getTimeJogador());

        novoTimeInscrito.setId(novoInscritoId);
        return timeInscritoRepository.save(novoTimeInscrito);

    }

}