package com.example.commerza.user.security;

import com.example.commerza.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;


@Component
public class JwtUtil {
    private static final String SECRET = "fIaLN/5EIZ/aRt4y+9opcsbGWGwld0qTp4UBe5nk7aM=";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email) {
        Date now = new Date();
        Date expiry = new Date(
                now.getTime() + 60 * 1000
        );
        return Jwts.builder().subject(email).issuedAt(now).expiration(expiry).signWith(key).compact();
    }

    public Claims extractClaims(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims;
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenExpired(String token) {

        Claims extractedExpiration = extractClaims(token);
        Date expiration = extractedExpiration.getExpiration();

        return expiration.before(new Date());
    }

    public boolean isTokenValid(String token, String email) {
        String emailFromToken = extractEmail(token);
        return (
                email.equals(emailFromToken) && !isTokenExpired(token)
        );
    }
}
