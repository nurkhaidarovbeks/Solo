package com.example.cloud.auth.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.Expiration.Ms}")
    private int jwtExpirationMs;

    public String generateJwtToken(String username) {

        return JWT.create()
            .withSubject(username)
            .withIssuedAt(new Date())
            .withExpiresAt(new Date((new Date()).getTime() + jwtExpirationMs))
            .sign(Algorithm.HMAC256(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        // Validation should be done by the caller (e.g., JwtFilter) before calling this method.
        // This method assumes the token is already validated for signature and expiration.
        return JWT.decode(token).getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        Logger logger = LoggerFactory.getLogger(this.getClass());
        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(authToken);
            return true;
        } catch (JWTVerificationException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }

        return false;
    }
}
