package com.caina.hc.service;

import com.caina.hc.model.TimeInscrito;
import com.caina.hc.repository.TimeInscritoRepository;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class GrupoService {

    private static final String LETRAS = "ABCDEFGHIJKLMNOP";
    private static final int TOTAL_OITAVAS = 16;

    private final TimeInscritoRepository timeInscritoRepository;
    private final JogoService jogoService;

    public GrupoService(TimeInscritoRepository timeInscritoRepository, JogoService jogoService) {
        this.timeInscritoRepository = timeInscritoRepository;
        this.jogoService = jogoService;
    }

    public void sortearGrupos(int numeroDeGrupos, String senha) {
        jogoService.validarSenha(senha);

        List<TimeInscrito> times = timeInscritoRepository.findAll();

        if (numeroDeGrupos <= 0 || TOTAL_OITAVAS % numeroDeGrupos != 0) {
            throw new RuntimeException();
        }
        if (times.isEmpty() || times.size() % numeroDeGrupos != 0) {
            throw new RuntimeException();
        }

        Collections.shuffle(times);

        int porGrupo = times.size() / numeroDeGrupos;
        for (int i = 0; i < numeroDeGrupos; i++) {
            String letra = String.valueOf(LETRAS.charAt(i));
            List<TimeInscrito> timesDoGrupo = times.subList(i * porGrupo, i * porGrupo + porGrupo);
            for (TimeInscrito time : timesDoGrupo) {
                time.setGrupo(letra);
            }
        }

        timeInscritoRepository.saveAll(times);
    }
}
