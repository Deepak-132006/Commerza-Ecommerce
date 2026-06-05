package com.example.commerza.user.security;

import com.example.commerza.user.entity.Role;
import com.example.commerza.user.entity.User;
import com.example.commerza.user.repository.UserRespository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final UserRespository userRespository;
    private final JwtUtil jwtUtil;

    public JwtFilter(UserRespository userRespository, JwtUtil jwtUtil) {
        this.userRespository = userRespository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extractEmail(token);

        if (email == null) {
            filterChain.doFilter(request, response);
            return;
        }

        User user = userRespository.findByEmail(email);

        if (user == null) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean valid = jwtUtil.isTokenValid(token, user.getEmail());

        if (valid) {

            Role role = user.getRole();
            String userRole = "ROLE_" + role.name();
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    List.of(new SimpleGrantedAuthority(userRole))
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            System.out.println("User authenticated" + email);
        }

        filterChain.doFilter(request, response);
    }
}
