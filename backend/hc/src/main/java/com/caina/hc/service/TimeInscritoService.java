package com.caina.hc.service;
import org.springframework.stereotype.Service;

import com.caina.hc.model.TimeInscrito;
import com.caina.hc.repository.TimeInscritoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class TimeInscritoService {

    private final TimeInscritoRepository timeInscritoRepository;

    public TimeInscritoService(TimeInscritoRepository timeInscritoRepository) {
        this.timeInscritoRepository = timeInscritoRepository;
    }

    public TimeInscrito saveTimeInscrito( TimeInscrito timeInscrito){
        return timeInscritoRepository.save(timeInscrito);
    }

}