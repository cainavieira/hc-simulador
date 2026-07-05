package com.caina.hc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration//avisa que é config class
public class CorsConfig implements WebMvcConfigurer {

    // Libera o front pra chamar a API sem o navegador bloquear. Coringa de
    // origem (não só localhost) de propósito: o front pode rodar de qualquer
    // IP/porta (dev local, rede local, ou exposto na internet pra jogar com
    // gente em redes diferentes) — não tem dado sensível nem autenticação de
    // verdade nesse app pra justificar travar por origem.
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
