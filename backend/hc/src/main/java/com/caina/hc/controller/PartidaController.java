package com.caina.hc.controller;

import com.caina.hc.dto.LinhaClassificacao;
import com.caina.hc.dto.ResultadoPartida;
import com.caina.hc.model.Partida;
import com.caina.hc.service.PartidaService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/partidas")
public class PartidaController {

    private final PartidaService partidaService;

    public PartidaController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    // Só o organizador chama, com a senha. Gera o rodízio de todos os grupos, uma vez só.
    @PostMapping("/gerar-rodadas")
    @ResponseStatus(HttpStatus.OK)
    public void gerarRodadas(@RequestParam String senha) {
        partidaService.gerarRodadas(senha);
    }

    // Todo mundo faz polling nisso pra saber a rodada atual (a de menor número
    // que ainda tem partida sem placar) e montar a tela de rodada.
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Partida> getPartidas() {
        return partidaService.getPartidas();
    }

    // Só o organizador chama, com a senha. Registra o placar das partidas da rodada atual.
    @PostMapping("/registrar-resultados")
    @ResponseStatus(HttpStatus.OK)
    public void registrarResultados(
            @RequestBody List<ResultadoPartida> resultados, @RequestParam String senha) {
        partidaService.registrarResultados(resultados, senha);
    }

    // Aberto pra todo mundo, sem senha — só leitura da classificação já calculada.
    @GetMapping("/classificacao")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, List<LinhaClassificacao>> getClassificacao() {
        return partidaService.getClassificacao();
    }
}
