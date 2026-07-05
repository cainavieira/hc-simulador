package com.caina.hc.service;

import org.springframework.stereotype.Service;

@Service
public class JogoService {

    // Senha fixa, só o organizador sabe.
    private static final String SENHA_MESTRE = "Lamelao12@!";


    //boolean simples de memoria sem persistencia que quebra o app deixando sempre true depois de um post
    private boolean jogoIniciado = false;

    public boolean isJogoIniciado() {
        return jogoIniciado;
    }

    public void iniciarJogo(String senha) {
        validarSenha(senha);
        jogoIniciado = true;
    }

    public void validarSenha(String senha) {
        if (!senha.equals(SENHA_MESTRE)) {
            throw new RuntimeException();
        }
    }
}
