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

    private static final int TOTAL_OITAVAS = 16;

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
                    novasPartidas.add(
                            new Partida("GRUPOS", grupo, rodada, confronto[0], confronto[1]));
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

    // Gera as oitavas cruzando os classificados de cada grupo. Funciona com
    // qualquer quantidade de classificados por grupo: junta todo mundo numa
    // lista única (ordenada por posição, depois por grupo) e cruza o melhor
    // colocado dessa lista com o pior, o segundo com o penúltimo, e assim por
    // diante — tipo chave de torneio de tênis. Isso garante que ninguém
    // enfrenta alguém do próprio grupo, e generaliza o caso clássico
    // ("1º vs 2º de outro grupo") pra qualquer número de classificados.
    public void gerarOitavas(String senha) {
        jogoService.validarSenha(senha);

        boolean oitavasJaExistem = partidaRepository.findAll().stream()
                .anyMatch(p -> "OITAVAS".equals(p.getFase()));
        if (oitavasJaExistem) {
            throw new RuntimeException();
        }

        Map<String, List<LinhaClassificacao>> classificacao = getClassificacao();
        List<String> gruposOrdenados = classificacao.keySet().stream().sorted().toList();
        int numeroDeGrupos = gruposOrdenados.size();
        int quantosPassam = TOTAL_OITAVAS / numeroDeGrupos;

        List<Integer> classificadosOrdenados = new ArrayList<>();
        for (int posicao = 0; posicao < quantosPassam; posicao++) {
            for (String grupo : gruposOrdenados) {
                classificadosOrdenados.add(classificacao.get(grupo).get(posicao).getTime().getId());
            }
        }

        List<Partida> novasPartidas = new ArrayList<>();
        int n = classificadosOrdenados.size();
        for (int i = 0; i < n / 2; i++) {
            int casa = classificadosOrdenados.get(i);
            int visitante = classificadosOrdenados.get(n - 1 - i);
            novasPartidas.add(new Partida("OITAVAS", null, 1, casa, visitante));
        }

        partidaRepository.saveAll(novasPartidas);
    }

    // Reaproveitado por gerarQuartas/gerarSemis: cruza os vencedores da fase
    // anterior em ordem (partida 1 x partida 2, partida 3 x partida 4, ...),
    // mantendo a ordem do chaveamento sem precisar recalcular seeding.
    private void gerarProximaFase(String faseAnterior, String novaFase, String senha) {
        jogoService.validarSenha(senha);

        boolean novaFaseJaExiste = partidaRepository.findAll().stream()
                .anyMatch(p -> novaFase.equals(p.getFase()));
        if (novaFaseJaExiste) {
            throw new RuntimeException();
        }

        List<Partida> partidasDaFaseAnterior = partidaRepository.findAll().stream()
                .filter(p -> faseAnterior.equals(p.getFase()))
                .sorted(Comparator.comparingInt(Partida::getId))
                .toList();

        if (partidasDaFaseAnterior.isEmpty()
                || partidasDaFaseAnterior.stream().anyMatch(p -> p.getVencedorId() == null)) {
            throw new RuntimeException();
        }

        List<Partida> novasPartidas = new ArrayList<>();
        for (int i = 0; i < partidasDaFaseAnterior.size(); i += 2) {
            int casa = partidasDaFaseAnterior.get(i).getVencedorId();
            int visitante = partidasDaFaseAnterior.get(i + 1).getVencedorId();
            novasPartidas.add(new Partida(novaFase, null, 1, casa, visitante));
        }

        partidaRepository.saveAll(novasPartidas);
    }

    public void gerarQuartas(String senha) {
        gerarProximaFase("OITAVAS", "QUARTAS", senha);
    }

    public void gerarSemis(String senha) {
        gerarProximaFase("QUARTAS", "SEMIS", senha);
    }

    // Diferente de gerarProximaFase: a semifinal produz duas partidas (a final,
    // com os dois vencedores, e a disputa de terceiro lugar, com os dois
    // perdedores), então não dá pra reaproveitar o cruzamento simples de
    // vencedor-a-vencedor.
    public void gerarFinal(String senha) {
        jogoService.validarSenha(senha);

        boolean finalJaExiste = partidaRepository.findAll().stream()
                .anyMatch(p -> "FINAL".equals(p.getFase()) || "TERCEIRO".equals(p.getFase()));
        if (finalJaExiste) {
            throw new RuntimeException();
        }

        List<Partida> semis = partidaRepository.findAll().stream()
                .filter(p -> "SEMIS".equals(p.getFase()))
                .sorted(Comparator.comparingInt(Partida::getId))
                .toList();

        if (semis.size() != 2 || semis.stream().anyMatch(p -> p.getVencedorId() == null)) {
            throw new RuntimeException();
        }

        Partida semi1 = semis.get(0);
        Partida semi2 = semis.get(1);
        int vencedor1 = semi1.getVencedorId();
        int vencedor2 = semi2.getVencedorId();
        int perdedor1 = vencedor1 == semi1.getTimeCasaId() ? semi1.getTimeVisitanteId() : semi1.getTimeCasaId();
        int perdedor2 = vencedor2 == semi2.getTimeCasaId() ? semi2.getTimeVisitanteId() : semi2.getTimeCasaId();

        partidaRepository.saveAll(List.of(
                new Partida("FINAL", null, 1, vencedor1, vencedor2),
                new Partida("TERCEIRO", null, 1, perdedor1, perdedor2)));
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

            if (resultado.placarCasa() > resultado.placarVisitante()) {
                partida.setVencedorId(partida.getTimeCasaId());
            } else if (resultado.placarVisitante() > resultado.placarCasa()) {
                partida.setVencedorId(partida.getTimeVisitanteId());
            } else if (!"GRUPOS".equals(partida.getFase())) {
                // Empate no mata-mata precisa de pênaltis — o front manda quem venceu.
                if (resultado.vencedorId() == null) {
                    throw new RuntimeException();
                }
                partida.setVencedorId(resultado.vencedorId());
            }
            // Empate na fase de grupos: vencedorId fica nulo, é um empate de verdade.

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

    // Igual à classificação, mas sem separar por grupo (não existe mais grupo
    // depois da fase de grupos) e **acumulando todas as fases já jogadas**
    // (GRUPOS + OITAVAS + QUARTAS + SEMIS), o placar de um time que caiu nas
    // oitavas continua contando dali pra frente, exatamente como a estatística
    // de um campeonato de verdade. Não faz sentido zerar a cada fase nova.
    public List<LinhaClassificacao> getEstatisticas() {
        List<TimeInscrito> times = timeInscritoRepository.findAll();
        List<Partida> partidas = partidaRepository.findAll();

        Map<Integer, LinhaClassificacao> linhasPorTimeId = new HashMap<>();
        for (TimeInscrito time : times) {
            linhasPorTimeId.put(time.getId(), new LinhaClassificacao(time));
        }

        for (Partida partida : partidas) {
            if (partida.getPlacarCasa() == null || partida.getPlacarVisitante() == null) {
                continue;
            }
            atualizarLinhas(linhasPorTimeId, partida);
        }

        return linhasPorTimeId.values().stream()
                .sorted(
                        Comparator.comparingInt(LinhaClassificacao::getPontos).reversed()
                                .thenComparing(Comparator.comparingInt(LinhaClassificacao::getSg).reversed())
                                .thenComparing(Comparator.comparingInt(LinhaClassificacao::getGp).reversed()))
                .toList();
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
