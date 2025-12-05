package com.example.cloud.auth.security.jwt;

import com.example.cloud.auth.security.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class); // Corrected logger class

    @Autowired
    public JwtFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            if (request.getHeader("Authorization") != null) {
                String header = request.getHeader("Authorization");
                if (header.startsWith("Bearer ")) {
                    String jwt = header.substring(7);
                    if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
                        String username = jwtUtil.getUserNameFromJwtToken(jwt);
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        logger.info("Setting SecurityContext for user: {}, authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        logger.info("SecurityContext successfully set for user: {}", userDetails.getUsername());
                    } else {
                        if (jwt != null) { // Only log if jwt was present but invalid
                            logger.warn("JWT token is invalid or validation failed for token: {}", jwt);
                        }
                    }
                } else {
                     logger.warn("Authorization header does not start with Bearer: {}", header);
                }
            } else {
                // logger.trace("No Authorization header found, proceeding with filter chain."); // Optional: for very verbose logging
            }
        }catch (Exception e){
            logger.error("Exception in JwtFilter doFilterInternal: {}", e.getMessage(), e);
        }
        filterChain.doFilter(request, response);
    }
}
