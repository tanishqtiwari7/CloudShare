package com.cloud.share.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow specific origins
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://localhost:3000");

        // Allow all headers and methods
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // Allow credentials
        config.setAllowCredentials(true);

        // Apply to all paths
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}