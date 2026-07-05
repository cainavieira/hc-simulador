package com.caina.hc.service;

import com.caina.hc.dto.LinhaClassificacao;
import com.caina.hc.dto.ResultadoPartida;
import com.caina.hc.model.Partida;
import com.caina.hc.model.TimeInscrito;
import com.caina.hc.repository.PartidaRepository;
import com.caina.hc.repository.TimeInscritoRepository;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final TimeInscritoRepository timeInscritoRepository;
    private final JogoService jogoService;

    public PartidaService(
            PartidaRepository partidaRepository,
            TimeInscritoRepository timeInscritoRepository,
            JogoService jogoService) {
        this.partidaRepository = partidaRepository;
        this.timeInscritoRepository = timeInscritoRepository;
        this.jogoService = jogoService;
    }

    public void gerarRodadas(String senha) {
        jogoService.validarSenha(senha);

        if (partidaRepository.count() > 0) {
            throw new RuntimeException();
        }

        List<TimeInscrito> times = timeInscritoRepository.findAll();
        Map<String, List<TimeInscrito>> porGrupo = times.stream()
                .collect(Collectors.groupingBy(TimeInscrito::getGrupo));

        List<Partida> novasPartidas = new ArrayList<>();

        for (Map.Entry<String, List<TimeInscrito>> entry : porGrupo.entrySet()) {
            String grupo = entry.getKey();
            List<TimeInscrito> timesDoGrupo = entry.getValue();

            // Por enquanto só suporta grupos com número par de times.
            // Pra suportar ímpar depois: adicionar um "bye" (time fantasma, id -1)
            // na lista antes de gerar os confrontos, e não criar Partida quando
            // um dos lados do confronto for o bye (esse time "descansa" na rodada).
            if (timesDoGrupo.size() % 2 != 0) {
                throw new RuntimeException();
            }

            List<Integer> ids = timesDoGrupo.stream().map(TimeInscrito::getId).toList();
            List<List<int[]>> confrontosPorRodada = gerarConfrontos(ids);

            for (int i = 0; i < confrontosPorRodada.size(); i++) {
                int rodada = i + 1;
                for (int[] confronto : confrontosPorRodada.get(i)) {
                    novasPartidas.add(new Partida(grupo, rodada, confronto[0], confronto[1]));
                }
            }
        }

        partidaRepository.saveAll(novasPartidas);
    }

    // Método do círculo: fixa o primeiro time e roda os outros a cada rodada,
    // garantindo que todo mundo joga com todo mundo exatamente uma vez.
    private List<List<int[]>> gerarConfrontos(List<Integer> idsTimes) {
        List<Integer> times = new ArrayList<>(idsTimes);
        int n = times.size();
        int totalRodadas = n - 1;
        List<List<int[]>> rodadas = new ArrayList<>();

        for (int r = 0; r < totalRodadas; r++) {
            List<int[]> confrontosDaRodada = new ArrayList<>();
            for (int i = 0; i < n / 2; i++) {
                int casa = times.get(i);
                int visitante = times.get(n - 1 - i);
                confrontosDaRodada.add(new int[] { casa, visitante });
            }
            rodadas.add(confrontosDaRodada);

            int ultimo = times.remove(times.size() - 1);
            times.add(1, ultimo);
        }

        return rodadas;
    }

    public List<Partida> getPartidas() {
        return partidaRepository.findAll();
    }

    public void registrarResultados(List<ResultadoPartida> resultados, String senha) {
        jogoService.validarSenha(senha);

        for (ResultadoPartida resultado : resultados) {
            Partida partida = partidaRepository.findById(resultado.id())
                    .orElseThrow(() -> new RuntimeException());
            partida.setPlacarCasa(resultado.placarCasa());
            partida.setPlacarVisitante(resultado.placarVisitante());
            partidaRepository.save(partida);
        }
    }

    public Map<String, List<LinhaClassificacao>> getClassificacao() {
        List<TimeInscrito> times = timeInscritoRepository.findAll();
        List<Partida> partidas = partidaRepository.findAll();

        Map<String, List<TimeInscrito>> porGrupo = times.stream()
                .collect(Collectors.groupingBy(TimeInscrito::getGrupo));

        Map<String, List<LinhaClassificacao>> resultado = new HashMap<>();

        for (Map.Entry<String, List<TimeInscrito>> entry : porGrupo.entrySet()) {
            String grupo = entry.getKey();

            Map<Integer, LinhaClassificacao> linhasPorTimeId = new HashMap<>();
            for (TimeInscrito time : entry.getValue()) {
                linhasPorTimeId.put(time.getId(), new LinhaClassificacao(time));
            }

            for (Partida partida : partidas) {
                if (!grupo.equals(partida.getGrupo())) {
                    continue;
                }
                if (partida.getPlacarCasa() == null || partida.getPlacarVisitante() == null) {
                    continue;
                }
                atualizarLinhas(linhasPorTimeId, partida);
            }

            List<LinhaClassificacao> ordenado = linhasPorTimeId.values().stream()
                    .sorted(
                            Comparator.comparingInt(LinhaClassificacao::getPontos).reversed()
                                    .thenComparing(Comparator.comparingInt(LinhaClassificacao::getSg).reversed())
                                    .thenComparing(Comparator.comparingInt(LinhaClassificacao::getGp).reversed()))
                    .toList();

            resultado.put(grupo, ordenado);
        }

        return resultado;
    }

    private void atualizarLinhas(Map<Integer, LinhaClassificacao> linhasPorTimeId, Partida partida) {
        LinhaClassificacao casa = linhasPorTimeId.get(partida.getTimeCasaId());
        LinhaClassificacao visitante = linhasPorTimeId.get(partida.getTimeVisitanteId());

        int golsCasa = partida.getPlacarCasa();
        int golsVisitante = partida.getPlacarVisitante();

        casa.setJogos(casa.getJogos() + 1);
        visitante.setJogos(visitante.getJogos() + 1);
        casa.setGp(casa.getGp() + golsCasa);
        casa.setGc(casa.getGc() + golsVisitante);
        visitante.setGp(visitante.getGp() + golsVisitante);
        visitante.setGc(visitante.getGc() + golsCasa);

        if (golsCasa > golsVisitante) {
            casa.setVitorias(casa.getVitorias() + 1);
            casa.setPontos(casa.getPontos() + 3);
            visitante.setDerrotas(visitante.getDerrotas() + 1);
        } else if (golsVisitante > golsCasa) {
            visitante.setVitorias(visitante.getVitorias() + 1);
            visitante.setPontos(visitante.getPontos() + 3);
            casa.setDerrotas(casa.getDerrotas() + 1);
        } else {
            casa.setEmpates(casa.getEmpates() + 1);
            casa.setPontos(casa.getPontos() + 1);
            visitante.setEmpates(visitante.getEmpates() + 1);
            visitante.setPontos(visitante.getPontos() + 1);
        }
    }
}
