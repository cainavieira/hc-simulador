package com.caina.hc.controller;

import com.caina.hc.service.JogoService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jogo")
public class JogoController {

    private final JogoService jogoService;

    public JogoController(JogoService jogoService) {
        this.jogoService = jogoService;
    }

    // Todo mundo na tela de espera fica chamando esse endpoint como um pooling
    @GetMapping("/status")
    @ResponseStatus(HttpStatus.OK)
    public boolean getStatus() {
        return jogoService.isJogoIniciado();
    }

    // Só o organizador chama esse, com a senha
    @PostMapping("/iniciar")
    @ResponseStatus(HttpStatus.OK)
    public void iniciarJogo(@RequestParam String senha) {
        jogoService.iniciarJogo(senha);
    }
}
