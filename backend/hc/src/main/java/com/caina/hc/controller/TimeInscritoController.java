package com.caina.hc.controller;

import org.springframework.web.bind.annotation.RestController;

import com.caina.hc.model.TimeInscrito;
import com.caina.hc.service.TimeInscritoService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1")
public class TimeInscritoController {

    private final TimeInscritoService timeInscritoService;

    public TimeInscritoController(TimeInscritoService timeInscritoService) {
        this.timeInscritoService = timeInscritoService;
    }

    @PostMapping("/times")
    @ResponseStatus(HttpStatus.CREATED)
    public TimeInscrito addTimeInscrito(@Valid @RequestBody TimeInscrito novoTimeInscrito) {
        return timeInscritoService.saveTimeInscrito(novoTimeInscrito);

    }

    // Procura pelo nome do jogador e por todos
    @GetMapping("/times")
    @ResponseStatus(HttpStatus.OK)
    public List<TimeInscrito> getAllInscritos(@RequestParam(required = false) String nomeJogador) {
        if (nomeJogador != null) {
            return List.of(timeInscritoService.getTimeInscritoByNomeJogador(nomeJogador));
        }
        return timeInscritoService.getTimesInscritos();
    }

    @GetMapping("/times/{timeId}")
    @ResponseStatus(HttpStatus.OK)
    public TimeInscrito getTimeInscrito(@PathVariable int timeId) {
        return timeInscritoService.getTimeInscritoById(timeId);
    }

    @DeleteMapping("/times/{timeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTimeInscrito(@PathVariable int timeId) {
        timeInscritoService.deleteTimeById(timeId);
    }

    @PutMapping("times/{timeId}")
    public TimeInscrito updateTimeInscrito(@PathVariable int timeId, @RequestBody TimeInscrito novoTimeInscrito) {
        return timeInscritoService.updateTimeInscrito(timeId, novoTimeInscrito);

    }

}
