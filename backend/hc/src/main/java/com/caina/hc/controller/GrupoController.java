package com.caina.hc.controller;

import com.caina.hc.service.GrupoService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/grupos")
public class GrupoController {

    private final GrupoService grupoService;

    public GrupoController(GrupoService grupoService) {
        this.grupoService = grupoService;
    }

    // Só o organizador chama com a senha. Sorteia uma vez só, salva no banco.
    @PostMapping("/sortear")
    @ResponseStatus(HttpStatus.OK)
    public void sortearGrupos(@RequestParam int numeroDeGrupos, @RequestParam String senha) {
        grupoService.sortearGrupos(numeroDeGrupos, senha);
    }
}
