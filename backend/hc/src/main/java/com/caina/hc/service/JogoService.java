package com.caina.hc.service;

import org.springframework.stereotype.Service;

@Service
public class JogoService {

    // Senha fixa, só o organizador sabe.
    private static final String SENHA_MESTRE = "Lamelao12@!";

    private boolean jogoIniciado = false;

    public boolean isJogoIniciado() {
        return jogoIniciado;
    }

    public void iniciarJogo(String senha) {
        if (!senha.equals(SENHA_MESTRE)) {
            throw new RuntimeException();
        }
        jogoIniciado = true;
    }
}
