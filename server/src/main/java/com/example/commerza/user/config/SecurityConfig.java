package com.example.commerza.user.config;

import com.example.commerza.user.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;

    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http.
                csrf(csrf -> csrf.disable()
                        .authorizeHttpRequests(auth -> auth.requestMatchers("/api/v1/auth/**").permitAll()

                                .requestMatchers(
                                        "/api/v1/admin/**"
                                ).hasRole("ADMIN")

                                .requestMatchers(
                                        "/api/v1/cart/**",
                                        "/api/v1/orders/**",
                                        "/api/v1/wishlist/**",
                                        "/api/v1/addresses/**",
                                        "/api/v1/users/**"
                                ).hasRole("USER")

                                .requestMatchers(
                                        "/api/v1/products/**",
                                        "/api/v1/categories/**"
                                ).permitAll()
                                .anyRequest().authenticated())
        );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
