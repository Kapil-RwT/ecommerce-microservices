package com.ecommerce.gateway.config;

import com.ecommerce.common.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {
    
    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
}
