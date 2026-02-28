package com.nitin.jobtracker.security;

import java.util.Date;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    private String secret = "your-256-bit-secret-key-here-make-it-longer";

    public String generateToken(String email) {
        byte[] secretBytes = secret.getBytes();
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000L))
                .signWith(new SecretKeySpec(secretBytes, 0, secretBytes.length, "HmacSHA256"), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        byte[] secretBytes = secret.getBytes();
        return Jwts.parserBuilder()
                .setSigningKey(new SecretKeySpec(secretBytes, 0, secretBytes.length, "HmacSHA256"))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
