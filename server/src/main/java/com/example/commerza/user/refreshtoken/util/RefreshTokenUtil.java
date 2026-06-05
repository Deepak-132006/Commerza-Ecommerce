package com.example.commerza.user.refreshtoken.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class RefreshTokenUtil {

    private final String SECRET_REFRESH_KEY = "xa835mmlwkVlU8KibGDfW2gRrm7FNK2st1cy5PV8h/Y=";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_REFRESH_KEY.getBytes());


    public String generateRefreshToken(String email) {
        Date now = new Date();
        Date expiry = new Date(
                now.getTime() + (7L * 24 * 60 * 60 * 1000)
        );
        return Jwts.builder().subject(email).issuedAt(now).expiration(expiry).signWith(key).compact();
    }

}
